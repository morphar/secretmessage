FROM alpine:latest
RUN mkdir /secretmessage.io
RUN mkdir /www
COPY ./ /secretmessage.io
CMD cp -r /secretmessage.io /www/
