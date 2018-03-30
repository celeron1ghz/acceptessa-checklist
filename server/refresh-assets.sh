#!/bin/sh
cd `dirname $0`
cd ../client

echo building...
yarn build

echo syncing...
cd build
aws s3 sync . s3://acceptessa-checklist-assets

echo invalidation...
NOW=`date +%s`

DIST_ID=`aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='acceptessa checklist'].Id" --output text`
aws cloudfront create-invalidation --distribution-id $DIST_ID --invalidation-batch "Paths={Quantity=1,Items=[/*]},CallerReference=$NOW"
