import browser from "webextension-polyfill";
import { devBookmarks } from "@/config/dev.bookmarks";
import { BookmarkNode } from "@/types/bookmark";

export async function getTwitchBookmarks(): Promise<BookmarkNode[]> {
  try {
    const bookmarks = await browser.bookmarks.search({
      title: "TwitchOrganizer",
    });
    if (bookmarks.length > 0) {
      const folder = bookmarks[0];
      const subTree = await browser.bookmarks.getSubTree(folder.id);
      return subTree[0].children || [];
    }
    return [];
  } catch (error) {
    console.error("Failed to get Twitch bookmarks:", error);
    return [];
  }
}

export async function initBookmarks(): Promise<void> {
  try {
    const bookmarks = await browser.bookmarks.search({
      title: "TwitchOrganizer",
    });
    if (bookmarks.length === 0) {
      await createBookmarkTree(devBookmarks as BookmarkNode);

      console.log("TwitchOrganizer bookmarks initialized");
    } else {
      console.log("TwitchOrganizer bookmarks already exist");
    }
  } catch (error) {
    console.error("Failed to initialize bookmarks:", error);
  }
}

async function createBookmarkTree(
  node: BookmarkNode,
  parentId?: string
): Promise<void> {
  const bookmarkData: any = {
    title: node.title,
  };
  if (parentId) {
    bookmarkData.parentId = parentId;
  }
  if (node.url) {
    bookmarkData.url = node.url;
  } else {
    bookmarkData.type = "folder";
  }
  console.log("Creating bookmark:", bookmarkData);
  const bookmark = await browser.bookmarks.create(bookmarkData);

  if (node.children) {
    for (const child of node.children) {
      await createBookmarkTree(child, bookmark.id);
    }
  }
}
