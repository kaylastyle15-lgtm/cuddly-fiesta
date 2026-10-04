# Spending Saving Guide

A single-file, fully local tool. Enter income and debts; it tells you what to pay, when, and how much to set aside.

**Run it:** open `index.html` in your browser (double-click). Or serve it locally only:

    cd spend-guide && python3 -m http.server 8000 --bind 127.0.0.1

Then visit http://127.0.0.1:8000.

**Privacy:** no storage (no cookies/localStorage), no network calls (enforced by a Content-Security-Policy), no dependencies. Closing the tab erases everything. "Download my data" is optional and only writes a file you choose to your own computer.
