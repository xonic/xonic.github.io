git checkout master
cp -r _site/* . && rm -rf _site/ && touch .nojekyll
git add .
git commit -m '- precompile for github'
git push --all origin
git checkout source