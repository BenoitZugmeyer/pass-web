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

* `-d`, `--debug`: log additional informations, useful for debugging purposes
* `-s STORE`, `--store STORE`: path of the password-store directory, defaults to
  `~/.password-store`
* `-p PORT`, `--port PORT`: port to use, defaults to `3000`

## Example

```
$ pass-web -p 9082 <(gpg --export-secret-keys -a)
```

## HTTPS concerns

In order to discourage from using `pass-web` on plain, unsecure HTTP, it will always bind
to `127.0.0.1`. Thus, you will need to configure a reverse proxy to use it externaly,
ideally with HTTPS support. You can easily have free SSL certificates and configuring a
HTTP server (like nginx) to do this. It's not that hard, just search the Web.

## Demo

For a preview of the interface you'll get when using this project, go to
[https://benoitzugmeyer.github.io/pass-web/](https://benoitzugmeyer.github.io/pass-web/)

## Notes

This is currently a read-only interface, and there is no plan to support all the features
of pass. The goal was to have a nice and simple access to the password store from anywhere. But if
you need other features, feel free to ask or contribute.

This project may have some security flaws. Please open an issue if something's fucky.
