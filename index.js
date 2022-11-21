const {
    Scraper,
    Root,
    OpenLinks,
    CollectContent,
  } = require("nodejs-web-scraper");
  
  async function scrape(type, pageNumbers) {
    let pages = [];
  
    const getPageObject = (pageObject, address) => {
      pages.push({
        ...pageObject,
        address,
        type: type,
      });
    };
  
    const config = {
      baseSiteUrl: `https://theodi.org/`,
      startUrl: `https://theodi.org/knowledge-opinion/${type}/`,
      filePath: "./images/",
      logPath: "./logs/",
    };
  
    const scraper = new Scraper(config);
    const root = new Root({
      pagination: { queryString: "page", begin: 0, end: pageNumbers },
    });
  
    const articles = new OpenLinks("a.o_card--blog", {
      name: "url",
      getPageObject,
    });
  
    const docUrl = new OpenLinks("a.m_cta", {
      name: "docUrl",
    });
  
    const story = new CollectContent("div.wpb_content_element ", {
      name: "story",
    });
    const synopsis = new CollectContent("section.o_page-synopsis ", {
      name: "synopsis",
    });
  
    const condition = (cheerioNode) => {
      const text = cheerioNode.text().trim(); //Get the innerText of the <a> tag.
      if (text !== "Related") {
        return true;
      }
    };
  
    const titles = new CollectContent(
      "div.o_page-header__inner h1.m_page-title",
      {
        name: "title",
        condition,
      }
    );
    const categories = new CollectContent("li.m_topic", {
      name: "categories",
    });
  
    const date = new CollectContent("div.m_page-date", {
      name: "date",
    });
  
    const author = new CollectContent("ul.o_page-contributors li h1", {
      name: "author",
    });
  
    root.addOperation(articles);
    if (type === "reports" || type === "guides") {
      articles.addOperation(docUrl);
    }
    articles.addOperation(titles);
    articles.addOperation(synopsis);
    articles.addOperation(categories);
    articles.addOperation(story);
    articles.addOperation(author);
    articles.addOperation(date);
  
    await scraper.scrape(root);
  
    return pages;
  }

  async function odiScrape(type, pageNumbers) {
    let page = await scrape(type, pageNumbers);
  
    const convertFormat = (d) => {
      let date = d.slice(4);
  
      date = date.replace(/,/g, "");
  
      final =
        date.split(" ")[1] + "/" + date.split(" ")[0] + "/" + date.split(" ")[2];
  
        console.log(final)
      if (final.includes("Jan")) {
        let monthC = final.replace(/Jan/g, "01");
        return monthC
      }
  
      if (final.includes("Feb")) {
        let monthC = final.replace(/Feb/g, "02");
        return monthC
      }
  
      if (final.includes("Mar")) {
        let monthC = final.replace(/Mar/g, "03");
        return monthC
      }
  
      if (final.includes("Apr")) {
        let monthC = final.replace(/Apr/g, "04");
        return monthC
      }
  
      if (final.includes("May")) {
        let monthC = final.replace(/May/g, "05");
        return monthC
      }
  
      if (final.includes("Jun")) {
        let monthC = final.replace(/Jun/g, "06");
        return monthC
      }
  
      if (final.includes("Jul")) {
        let monthC = final.replace(/Jul/g, "07");
        return monthC
      }
  
      if (final.includes("Aug")) {
        let monthC = final.replace(/Aug/g, "08");
        return monthC
      }
  
      if (final.includes("Sep")) {
        let monthC = final.replace(/Sep/g, "09");
        return monthC
      }
  
      if (final.includes("Oct")) {
        let monthC = final.replace(/Oct/g, "10");
        return monthC
      }
  
      if (final.includes("Nov")) {
        let monthC = final.replace(/Nov/g, "11");
        return monthC
      }
  
      if (final.includes("Dec")) {
        let monthC = final.replace(/Dec/g, "12");
        return monthC
      }
    };
  
    for (let i = 0; i < page.length; i++) {
      page[i].title = page[i].title.join("");
      page[i].synopsis = page[i].synopsis.join("");
      page[i].categories = page[i].categories.join(", ");
      page[i].author = page[i].author.join(", ");
      page[i].date = convertFormat(page[i].date.join(""));
      page[i].story = page[i].story.join("");
      if (page[i].docUrl !== undefined) {
        let fixedAddress = page[i].docUrl.map((docUrl) => {
          let keyRemoved = Object.values(docUrl);
          return keyRemoved;
        });
        page[i].docUrl = fixedAddress.flat().join(", ");
      }
    }
    return page;
  }


  module.exports = odiScrape;

  
  
  