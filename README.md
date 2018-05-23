``` AWS S3 Bucket Object List
await s3.listObjects({
      Bucket: bucket
    }).on('success', function handlePage(res) {
```
    
``` AWS S3 Bucket Object Get
s3.getObject({
              Bucket: bucket,
              Key: data.Key
            }, function(error, obj) {
```
