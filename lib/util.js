var crypto = require('crypto');

module.exports = {
    // TODO ditambahin fungsi validasi MSISDN juga harusnya
  formatMsisdn: function (msisdn) {
      var s = msisdn+"";
      s = s.trim();
      if (s.startsWith("+628")) {
          s = s.substring(3);
      } else if (s.startsWith("08")) {
          s = s.substring(1);
      } if (s.startsWith("628")) {
        s = s.substring(2);
      }
      return s;
  },

  randomStringAsBase64Url: function(size) {
    return crypto.randomBytes(size).toString("base64");
  }
}