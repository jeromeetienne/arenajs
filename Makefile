#!/usr/bin/make
# little make file to 


clean	: brequire_clean

#################################################################################
#										#
#################################################################################

brequire:
	brequire lib www/brequired

brequire_clean:
	rm www/brequired/*.js
	
brequire_monitor: brequire
	(while inotifywait -r -e modify,attrib,create lib ; do make brequire; done)

deployGhPage:
	rm -rf /tmp/wargameGhPages
	(cd /tmp && git clone git@github.com:jeromeetienne/wargame.git wargameGhPages)
	(cd /tmp/wargameGhPages && git checkout gh-pages)
	cp -a lib/ www/ /tmp/wargameGhPages
	(cd /tmp/wargameGhPages && git add . && git commit -a -m "Another deployement" && git push origin gh-pages)
	#rm -rf /tmp/wargameGhPages
