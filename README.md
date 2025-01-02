# Codebase stats collector module

Module to collect data from a git repository.

## How to run:

```
SOURCE_DIR=<PATH TO LOCAL GIT REPO>  npm run run-dev
```

Set `NODE_ENV=production` to skip debug logs

```
SOURCE_DIR=<PATH TO LOCAL GIT REPO> NODE_ENV=production npm run run-dev
```

Set `NODE_ENV=debug` to show extra debug logs

```
SOURCE_DIR=<PATH TO LOCAL GIT REPO> NODE_ENV=debug npm run run-dev
```

## Collected data:

### The most changed files

In bash:

```
$ git log --since 2019-01-01 --name-status $* | grep -E '^[A-Z]\s+' | cut -c3-500 | sort | uniq -c | grep -vE '^ {6}1 ' | sort -n
```

### Number of contributors for a file

In bash for a single file:

```
$ git log --name-status PATH/TO/FILE | grep 'Author' | sort | uniq -c | wc -l
```

In bash for all files:

```
git ls-tree -r --name-only mainline ./src | while read file ; do
  NUMBER_OFCONTRIBUTORS=$(git log --name-status $file | grep 'Author' |  sort | uniq -c | wc -l)
  echo "$NUMBER_OFCONTRIBUTORS $file"
done | sort -n
```
