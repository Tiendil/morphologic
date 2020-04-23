npm run build

cd dist

git add -A

git commit -m 'deploy github pages'

cd ..

git subtree push --prefix dist origin gh-pages
