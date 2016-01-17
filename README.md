# pass-web

A web interface for [pass](http://www.passwordstore.org/) (password-store).

## Install

For those lucky enough to run Arch Linux, you should install it [from
AUR](https://aur.archlinux.org/packages/pass-web)

For other, you can install it via npm:

```
$ npm install -g pass-web
```

You will need nodejs 5+ to run it.

## Usage

```
pass-web [OPTION]... PGPKEY...
```

Launch the HTTP server. The `PGPKEY` arguments are paths to the exported (armored, encrypted) pgp
secret keys.

The server will use HTTPS only if the options `--key` and `--cert` are provided.

Options:

* `-d`, `--debug`: log additional information, useful for debugging purposes
* `-s STOREPATH`, `--store STOREPATH`: path of the password-store directory, defaults to
  `~/.password-store`
* `-p PORT`, `--port PORT`: port to use, defaults to `3000`
* `--url-base-dir URLBASEDIR`: url subdirectory being used to serve the app, defaults to `/`. For
  example, `/pass-web` for a server at `https://example.com/pass-web`
* `--key KEY`: path to key file to use for SSL. If omitted, serves without SSL
* `--cert CERT`: path to certificate file to use for SSL. If omitted, serves without SSL
* `--htpasswd HTPASSWD`: htpasswd file to use for additional HTTP basic authentication. If omitted,
  no authentication will be used

## Examples

```
$ pass-web -p 9082 <(gpg --export-secret-keys -a)
$ pass-web \
    -p 8081 \
    -s /path/to/pass/store \
    --url-base-dir /pass-web
    --key /path/to/ssl/key \
    --cert /path/to/ssl/cert secretKeyFile \
    --htpasswd /path/to/htpasswd
```

## HTTPS concerns

You should always use HTTPS to serve this application. Please use the `--cert` and `--key` options
to provide an SSL certificate and key, or use another HTTP server (like nginx) configured to serve
this through an HTTPS-enabled reverse proxy.

## Demo

For a preview of the interface you'll get when using this project, go to
[https://benoitzugmeyer.github.io/pass-web/](https://benoitzugmeyer.github.io/pass-web/)

## Notes

This is currently a read-only interface, and there is no plan to support all the features
of pass. The goal was to have a nice and simple access to the password store from anywhere. But if
you need other features, feel free to ask or contribute.

This project may have some security flaws. Please open an issue if something's fucky.
