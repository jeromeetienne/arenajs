#!/usr/bin/make
# little make file to 


clean	: brequire_clean

build	: brequire_build


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

deploy:	deployGhPage;

deployGhPage:
	rm -rf /tmp/jsbattleGhPages
	(cd /tmp && git clone git@github.com:jeromeetienne/jsbattle.git jsbattleGhPages)
	(cd /tmp/jsbattleGhPages && git checkout gh-pages)
	cp -a Makefile lib/ www/ /tmp/jsbattleGhPages
	(cd /tmp/jsbattleGhPages && rm www/brequired/.gitignore && make brequire_build)
	(cd /tmp/jsbattleGhPages && git add . && git commit -a -m "Another deployement" && git push origin gh-pages)
	#rm -rf /tmp/jsbattleGhPages
