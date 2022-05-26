# server-manager
App manages servers. Springboot on the backend and angular along with rxjs on the front.

_Note:_

- **server-app** contains the angular code
- **server** contains the java/spring code

## Running

Front-end: Type `ng serve` on the cli and hit enter.

Back-end: run with your favorite IDE. In my case, I just hit `run` with intellij on `ServerApplication.java`

## What it does?

- Add a server
- Ping to check out if a machine is connected
- Delete a server
- Export the contents of the table in `.xls` or `.pdf` format.
