#!/usr/bin/make
# to automatize repeatitive actions

PROJECT_NAME=jsbattle


clean	: brequire_clean

build	: homepage_build brequire_build doc_build 

test	: jshint

doc	: doc_build

#################################################################################
#		misc								#
#################################################################################

homepage_build:
	pandoc -A ~/.pandoc.header.html -s README.md -o index.html
	sed -i "s/github.com\/you/github.com\/jeromeetienne\/$(PROJECT_NAME)/g" index.html

jshint	:
	jshint lib/*.js

doc_build:
	dox --title "jsbattle - the war of the bots"			\
		--desc "coders vs coders figthing over tank bots"	\
		lib/*.js > doc/index.html

#################################################################################
#		brequire							#
#################################################################################

brequire_build:
	brequire lib www/brequired

brequire_clean:
	rm -f www/brequired/*.js
	
brequire_monitor: brequire_build
	(while inotifywait -r -e modify,attrib,create lib ; do make brequire_build; done)

#################################################################################
#		deploy								#
#################################################################################

deploy:	deployGhPage

deployGhPage:
	rm -rf /tmp/$(PROJECT_NAME)GhPages
	(cd /tmp && git clone git@github.com:jeromeetienne/$(PROJECT_NAME).git $(PROJECT_NAME)GhPages)
	(cd /tmp/$(PROJECT_NAME)GhPages && git checkout gh-pages)
	cp -a Makefile lib/ www/ *.html .nojekyll /tmp/$(PROJECT_NAME)GhPages
	(cd /tmp/$(PROJECT_NAME)GhPages && rm www/brequired/.gitignore && make brequire_build)
	(cd /tmp/$(PROJECT_NAME)GhPages && git add . && (git commit -a -m "Another deployement" || true))
	(cd /tmp/$(PROJECT_NAME)GhPages && git push origin gh-pages)
	#rm -rf /tmp/$(PROJECT_NAME)GhPages
