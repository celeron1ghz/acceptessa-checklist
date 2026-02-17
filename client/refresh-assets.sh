#!/bin/sh
cd `dirname $0`

echo building...
yarn build
yarn buildConfigV2

echo syncing...
cd build
aws s3 sync . s3://acceptessa-checklist --delete

echo invalidation...
NOW=`date +%s`

DIST_ID=`aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='acceptessa checklist'].Id" --output text`
aws cloudfront create-invalidation --distribution-id $DIST_ID --invalidation-batch "Paths={Quantity=1,Items=[/*]},CallerReference=$NOW"
