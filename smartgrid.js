const smartgrid = require('smart-grid');

const settings = {
  outputStyle: 'scss',
  columns: 12,
  offset: '20px',
  mobileFirst: true,
  container: {
    maxWidth: '100%',
    fields: '10px'
  },
  breakPoints: {
    lg: {
      width: '1035px'
    },
    md: {
      width: '860px',
      fields: '20px'
    },
    sm: {
      width: '720px',
      fields: '15px'
    },
    xs: {
      width: '576px'
    },
    xxs: {
      width: '380px'
    }
  }
};

smartgrid('./resources/sass/mixins', settings);
