const AWS = require('aws-sdk');
const sharp = require('sharp');

AWS.config.region = 'ap-north';
AWS.config.update({ accessKeyId: '', secretAccessKey: '' });
const s3 = new AWS.S3();
const bucket = 'image.domain.com';

s3.listObjects({
  Bucket: bucket
}).on('success', function handlePage(res) {
  for(var i = 0; i < res.data.Contents.length; i++) {
    const data = res.data.Contents[i];    
    s3.getObject({
      Bucket: bucket,
      Key: data.Key
    }, function(error, obj) {
      const resize = size => sharp(obj.Body)
        .resize(size)
        .toBuffer()
        .then((buffer) => {
          s3.upload({
            Bucket: bucket,
            Key: thumbnailPaths[size] + '/' + data.Key,
            Body: buffer,
            ACL: 'private',
            ContentType: obj.ContentType
          }, (err, data) => {
            if (err) {
              return console.log(err);
            }
          });      
        })
        .catch(err => {
          console.log(err);
        });

      sharp(obj.Body).metadata().then(function(metadata) {
        let thumbArr = [];
        if (metadata.width >= thumbWidthL) {
          thumbArr = [thumbWidthL, thumbWidthM, thumbWidthS];
        } else if (metadata.width >= thumbWidthM) {
          thumbArr = [thumbWidthM, thumbWidthS];
        } else if (metadata.width >= thumbWidthS) {
          thumbArr = [thumbWidthS];
        }
        Promise
          .all(thumbArr.map(resize))
          .then(() => {
          });
      }).catch(function (err) {
        console.log('sharp error : ', err);
      });
      if (error) {
        console.log('s3.getObject.Err:', error);
      }

    });
  }
}).send();
