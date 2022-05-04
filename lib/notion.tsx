import { Client } from "@notionhq/client";

export type FieldType = {
  name: string;
  type:
    | "url"
    | "number"
    | "boolean"
    | "multi_select"
    | "select"
    | "rich_text"
    | "title"
    | "files";
  newName?: string;
};
const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

const showPublishedOnly = process.env.PUBLISHED_ONLY;

const parseItem = (type: string, item) => {
  if (type === "url" || type === "number") return item;
  if (type === "multi_select") return item.map((item: any) => item.name);
  if (type === "select") return  { text: item?.name || null, color: item?.color || null};
  if (type === "rich_text" || type === "title")
    return item[0]?.plain_text || null;
  if (type === "files") return item[0]?.file.url;
  if (type === "boolean") return item[0]?.checkbox;
  if (type === "number") {
   console.log({item})
    return item[0]?.checkbox;
  }

  return null;
};

const parseDatabase = async (id: string, fields: FieldType[]) => {
  const database = await notion.databases.query({
    database_id: id,
  });

  const items = database.results.map((item) => {
    const result = { id: item.id, votes: 0 };
    if ("properties" in item) {
      const { properties } = item;

      fields.forEach(({ name, type, newName }) => {
        if (type in properties[name]) {
          result[newName || name] = parseItem(type, properties[name][type]);
        }
      });

      if (item.icon && "external" in item?.icon) {
        result["icon"] = item.icon.external.url;
      }
    }
    return result;
  });

  return items.sort((a, b) => b.votes - a.votes);
};

export type BlockType = {
  type: string;
  data: {
    language?: string;
    text?: string;
  };
};

const getBlocksFromPage = async (pageId: string) => {
  const page = await notion.blocks.children.list({
    block_id: pageId,
  });

  const blocks = page.results;

  const parsedBlocks = blocks.map((block) => {
    const { type } = block;

    const result = { type };

    if (type === "paragraph") {
      result["data"] = {
        text: block["paragraph"].rich_text
          .map((text) => text.plain_text)
          .join(""),
      };
    }

    if (type === "heading_2") {
      result["data"] = {
        text: block["heading_2"].rich_text
          .map((text) => text.plain_text)
          .join(""),
      };
    }

    if (type === "bulleted_list_item") {
      result["data"] = {
        text: block["bulleted_list_item"]["rich_text"].map(
          (text) => text.plain_text
        ),
      };
    }

    if (type === "image") {
      result["data"] = {
        text: block["image"]["file"]["url"],
      };
    }

    if (type === "code") {
      const item = block["code"];

      result["data"] = {
        language: item.language,
        text: item.rich_text.map((text) => text.plain_text).join(""),
      };
    }

    return result;
  });

  return parsedBlocks;
};

const getPageTitle = async (id: string, fieldName: string = "name") => {
  const page = await notion.pages.retrieve({
    page_id: id,
  });

  if ("properties" in page && "title" in page.properties[fieldName]) {
    return page.properties[fieldName]["title"][0]?.plain_text;
  }

  return "";
};

export { notion, parseDatabase, getBlocksFromPage, getPageTitle };
