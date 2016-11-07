#!/usr/bin/env bash
set -e

sed -i '' 's/display:-webkit-box,-moz-box,-ms-flexbox,-webkit-flex,flex/display:flex/' build/index.html

sed -i '' 's/<link href="\/static\/css\/main\..*\.css" rel="stylesheet">//' build/index.html
sed -i '' 's/<script type="text\/javascript" src="\/static\/js\/main/<script async type="text\/javascript" src="\/static\/js\/main/' build/index.html