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
pass-web [-d] [-s STORE] [-p PORT] pgpkey...
```

Launch the HTTP server. The `pgpkey` arguments are paths to the exported (armored, encrypted) pgp
secret keys.

Options:

* `-d`, `--debug`: log additional information, useful for debugging purposes
* `-s STORE`, `--store STORE`: path of the password-store directory, defaults to
  `~/.password-store`
* `-p PORT`, `--port PORT`: port to use, defaults to `3000`
* `-u URLPREFIX`, `--urlpre URLPREFIX`: url subdirectory being used, for example
  `/pass-web` for a server at `https://example.com/pass-web`
* `-k KEY`, `--key KEY`: full path to key file to use for ssl
* `-c CERT`, `--cert CERT`: full path to certificate file to use for ssl
* `-h HTPASSWD`, `--htpasswd HTPASSWD`: htpasswd file to use for initial web page
  basic authentication and access (may be different than gpg password). If
  ommitted, no authentication will be used.

## Examples

```
$ pass-web -p 9082 <(gpg --export-secret-keys -a)
$ pass-web -p 8081 -s /path/to/pass/store -u /pass-web -k /path/to/ssl/key -c /path/to/ssl/cert secretKeyFile -p 34567 -h /path/to/htpasswd
```

## HTTPS concerns

You may want to configure a reverse proxy to use it externaly, pointing to the subdirectory used with the `-u` switch, above. You can use an HTTP server (like nginx) to do this.

## Demo

For a preview of the interface you'll get when using this project, go to
[https://benoitzugmeyer.github.io/pass-web/](https://benoitzugmeyer.github.io/pass-web/)

## Notes

This is currently a read-only interface, and there is no plan to support all the features
of pass. The goal was to have a nice and simple access to the password store from anywhere. But if
you need other features, feel free to ask or contribute.

This project may have some security flaws. Please open an issue if something's fucky.
