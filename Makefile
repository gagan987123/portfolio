.PHONY: help install dev cms edit open build preview stop clean

help:
	@echo "Portfolio — common commands"
	@echo ""
	@echo "  make edit      Start the site + CMS, open both in the browser"
	@echo "  make dev       Start the site only        (localhost:4321)"
	@echo "  make cms       Start the CMS proxy only   (localhost:8081)"
	@echo "  make open      Open site + admin in browser"
	@echo "  make build     Build static site into dist/"
	@echo "  make preview   Preview the production build"
	@echo "  make stop      Stop the site and CMS proxy"
	@echo "  make install   Install dependencies"
	@echo "  make clean     Remove build output"

install:
	npm install

dev:
	@npm run dev
	@echo "site:  http://localhost:4321"

cms:
	npm run cms

edit:
	@npm run dev
	@nohup npm run cms > /tmp/portfolio-cms.log 2>&1 & echo $$! > /tmp/portfolio-cms.pid
	@sleep 1
	@echo "site:  http://localhost:4321"
	@echo "admin: http://localhost:4321/admin/index.html"
	@open http://localhost:4321/
	@open http://localhost:4321/admin/index.html

open:
	@open http://localhost:4321/
	@open http://localhost:4321/admin/index.html

build:
	npm run build

preview:
	npm run preview

stop:
	-@npx astro dev stop >/dev/null 2>&1 || true
	-@pkill -f decap-server >/dev/null 2>&1 || true
	-@rm -f /tmp/portfolio-cms.pid
	@echo "stopped"

clean:
	rm -rf dist .astro
