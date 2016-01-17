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

The executable is called `pass-web`. Use `pass-web --help` to get help.

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
