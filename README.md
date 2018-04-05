# [secretmessage.io](https://secretmessage.io/) BETA

Secret Message is an attempt to create a secure and easy way to share passwords and other sensitive information, without having to e.g. use a shared password manager.

This repo contains all of the code used on the website [Secret Message](https://secretmessage.io/).

The technical details of the implementation will be documented on the website.

## Bugs

If you find any bugs, please oh please do report it 🙏  
Or even better: submit a pull request 😘

## Security

I have tried to keep things simple, conventional, standard and "boring".  
I haven't invented anything new, but utilized the common standards and the browers' crypto library [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).  
Everything is handled in the browser, nothing is sent to a server or third party.

## TODO
A non-complete list of missing things

- [ ] Create checks and warning for needed/missing browser features like crypto
- [ ] Error messages for
  - [ ] Wrong password
  - [ ] Missing libs
  - [ ] Known errors
  - [ ] Any other errors 
- [ ] Add pages
  - [ ] About
  - [ ] Privacy
  - [ ] Security
  - [ ] Terms
- [ ] Fix footer + add links to pages
- [ ] Helper function to generate a memorable / communicable pass phrase
- [ ] Pass phrase entropy indicator (from red -> green)
- [ ] Tests (desktop and mobile)
  - [ ] MSIE
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Cross browser encrypt / decrypt




  
