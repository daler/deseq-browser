DESeq browser
-------------

Note
~~~~
See `entabled <https://github.com/daler/entabled>`_ for a more generic way of
doing this...specifically, see the ``deseq2table.py`` script included with
``entabled`` for the same functionality described below.

Usage
~~~~~
Converts a table of DESeq results that was created by::

    write.table(res, file='results.txt', sep='\t', row.names=FALSE)

into a single HTML file  with controls for [surprisingly responsive] max/min
filtering and searching.  Given that there are quite a few CSS and JavaScript
files needed, these are copied to the output dir as well.

To try it out, simply run the script in the directory::

    python deseq2table.py

and then view ``example/deseq.html`` in a browser.

General usage::

    $ deseq2table.py --deseq results.txt --output experiment_1

Then view ``experiment_1/deseq.html``.

Uses `DataTables <http://www.datatables.net/>`_, `jQuery <http://jquery.com/>`_,
and `Bootstrap <http://twitter.github.com/bootstrap/>`_.
