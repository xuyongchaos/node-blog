const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
});

exports.User.index({ name: 1 }, { unique: true }).exec(); //根据用户名找到用户,用户名全局唯一

const moment = require('moment');
const objectidToTimestamp = require('objectid-to-timestamp');

// 根据id 生成创建时间 created_at
mongolass.plugin('addCreateAt', {
  afterFind: function(results) {
    results.forEach(item => {
      item.created_at = moment(
        objectidToTimestamp(item._id).format('YYYY-MM-DD HH:mm')
      );
    });
    return results;
  },
  afterFindOne: function(result) {
    if (result) {
      result.created_at = moment(
        objectidToTimestamp(item._id).format('YYYY-MM-DD HH:mm')
      );
    }
    return result;
  }
});

exports.Post = mongolass.model('Port', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  pv: { type: 'number', default: 0 }
});

exports.Post.index({ author: 1, _id: -1 }).exec(); //按创建时间降序查看用户的文章列表

exports.Article = mongolass.model('Article', {
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  tag: { type: 'string', required: true }
});

exports.Article.index({title: 1 }).exec(); //通过文章的id 获取文章下的所有留言，按留言创建时间升序
