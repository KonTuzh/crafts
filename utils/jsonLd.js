const wordCount = str => {
  return str.split(' ').filter(n => {
    return n !== '';
  }).length;
};

class JsonLd {
  constructor() {
    this.json = {};
    this.domain = process.env.DOMAIN;
    this.siteName = process.env.SITE_NAME;
    this.siteLogo = `${this.domain}/images/branding/logo@3x.png`;
    this.sameAs = ['https://vk.com/podelkirukamy'];
    this.author = '';

    this.website();
  }

  website() {
    this.json.website = {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.domain,
      sameAs: this.sameAs,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.domain}/search?query={query}`,
        'query-input': 'required name=query'
      }
    };
  }

  getWebsite(key = 'name') {
    return this.json.website[key];
  }

  webpage(page) {
    this.json.webpage = {
      '@context': 'http://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.desc,
      url: `${this.domain}/${page.alias}`
    };
  }

  breadcrumb(list) {
    const itemListElement = [];

    list.forEach((item, index) => {
      itemListElement.push({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'WebSite',
          '@id': `${this.domain}/${item.url}`,
          name: item.name
        }
      });
    });

    this.json.webpage.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement
    };
  }

  mainEntityPost(post) {
    this.author = post.owner.lastName
      ? `${post.owner.firstName} ${post.owner.lastName}`
      : post.owner.firstName;

    this.json.webpage.mainEntity = {
      '@type': 'Article',
      '@id': `${this.domain}/${post.category.slug}/${post.slug}#post-${post.id}`,
      headline: post.heading,
      alternativeHeadline: post.title,
      image: {
        '@type': 'imageObject',
        url: `${this.domain}/images/posts/${post.cover}_1600.jpeg`,
        width: '1600',
        height: '800'
      },
      author: this.author,
      editor: this.author,
      genre: post.category.heading,
      keywords: post.keywords ? post.keywords.join(' ') : '',
      wordcount: post.content ? wordCount(post.content) : 0,
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: this.siteLogo
        }
      },
      url: `${this.domain}/${post.category.slug}/${post.slug}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.domain}/${post.category.slug}/${post.slug}`
      },
      datePublished: post.publishedAt,
      dateCreated: post.createdAt,
      dateModified: post.updatetAt,
      description: post.description
    };
  }

  mainEntityPerson(user) {
    const fullName = user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName;

    this.json.webpage.mainEntity = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name: fullName,
      alternateName: user.firstName,
      description: user.content || this.json.webpage.description,
      mainEntityofPage: {
        '@type': 'ProfilePage',
        '@id': `${this.domain}/user/${user.id}`,
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'http://schema.org/FollowAction',
          userInteractionCount: user.followerCount
        }
      },
      image: `${this.domain}/images/users/${user.photo}_500.jpeg`
    };

    if (user.url) {
      this.json.webpage.mainEntity.url = user.url;
    }
  }

  getPerson(key = 'name') {
    return this.json.webpage.mainEntity[key];
  }

  getPageTitle() {
    return this.json.webpage.name;
  }

  getPageDescription() {
    return this.json.webpage.description;
  }

  getAuthor() {
    return this.author;
  }

  getPostImage(key = 'url') {
    return this.json.webpage.mainEntity.image[key];
  }

  getBreadcrumb(n = null) {
    if (n) return this.json.webpage.breadcrumb.itemListElement[n].item;
    return this.json.webpage.breadcrumb.itemListElement;
  }

  output() {
    const result = [];

    if (this.json.website) {
      result.push(this.json.website);
    }

    if (this.json.webpage) {
      result.push(this.json.webpage);
    }

    return JSON.stringify(result);
  }
}

module.exports = JsonLd;
