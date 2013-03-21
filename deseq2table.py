"""
GUI, in a web browser, for exploring DESeq results using DataTables + jQuery
+ Bootstrap.

Converts a DESeq results file, as saved from R with::

    write.table(res, sep='\\t', row.names=FALSE)`

into a JavaScript array and places it in an HTML template.
"""
import os
import argparse
import jinja2
import simplejson

HERE = os.path.dirname(__file__)

# copy these over to destination
required_files = [
    'static/js/DataTables-1.9.4/media/js/jquery.js',
    'static/bootstrap/js/bootstrap.min.js',
    'static/js/DataTables-1.9.4/media/js/jquery.dataTables.js',
    'static/js/tools.js',
    'static/bootstrap/css/bootstrap.css',
    'static/css/deseq.css'
]
required_files = [os.path.join(HERE, i) for i in required_files]


def deseq2html(deseq, outdir, limit=None):
    """
    Converts DESeq results into a JavaScript array that is then placed into an
    HTML template.
    """
    # Save the header, and convert the rest of the text file into a list of
    # lists which will be placed into the template as a JavaScript array.
    #
    # However, we need to keep non-floats as strings in order to keep
    # JavaScript happy, hence the extra handling.
    f = open(deseq)
    header = f.readline().strip().replace('"', '').split('\t')
    deseqs = []
    for i, line in enumerate(f):
        if limit and (i == limit):
            break
        newrow = []
        line = line.strip().replace('"', '')
        for field in line.split('\t'):
            if field not in ('NA', '-Inf', 'Inf'):
                try:
                    field = float(field)
                except ValueError, TypeError:
                    pass
            newrow.append(field)
        deseqs.append(newrow)

    # Get template
    loader = jinja2.FileSystemLoader(
        os.path.join(
            os.path.dirname(__file__),
            'templates')
    )
    env = jinja2.Environment(loader=loader)
    template = env.get_template('template.html')

    if not os.path.exists(outdir):
        os.makedirs(outdir)

    # Write output.  `numeric` list contains fields that will have
    # accordion-style min/max controls
    fout = open(os.path.join(outdir, 'deseq.html'), 'w')
    fout.write(
        template.render(
            header=header,
            deseqs=deseqs,
            numeric=[
                'baseMeanA',
                'baseMeanB',
                'foldChange',
                'log2FoldChange',
                'padj']
        )
    )
    fout.close()
    for req in required_files:
        subdir = os.path.join(
            outdir,
            os.path.dirname(
                os.path.relpath(req, start=HERE)
            )
        )
        if not os.path.exists(subdir):
            os.makedirs(subdir)
        os.system('cp %s %s' % (req, subdir))

if __name__ == "__main__":
    ap = argparse.ArgumentParser(usage=__doc__)
    ap.add_argument(
        '--deseq',
        default="example_results.txt",
        help='DESeq results text file (default: "example_results.txt"')
    ap.add_argument(
        '--output',
        default="example",
        help='Output directory to populate with HTML file plus '
        'JavaScript and CSS (default: "./example")')
    ap.add_argument(
        '--limit', type=int,
        help='Optional number of rows to limit output to (useful for testing')
    args = ap.parse_args()
    deseq2html(args.deseq, args.output, args.limit)
