.PHONY: push

push:
	git add -A
	git commit -m "Push"
	git push

write:
	hugo serve -D & open http://localhost:1313