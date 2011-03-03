#!/usr/bin/make
# little make file to 

brequire:
	brequire lib www/brequired
	
brequire_monitor: brequire
	(while inotifywait -r -e modify,attrib,create lib ; do make brequire; done)
