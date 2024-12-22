import browser from "webextension-polyfill";
import { devBookmarks } from "@/config/dev.bookmarks";
import { BookmarkNode } from "@/types/bookmark";

function cleanBookmarkTree(node: BookmarkNode): BookmarkNode {
  // Clone le noeud pour éviter de modifier l'original
  const cleanNode = { ...node };
  
  // Nettoie le titre en enlevant "- Twitch"
  if (cleanNode.title) {
    cleanNode.title = cleanNode.title.replace(/\s*-\s*Twitch$/i, '');
  }

  // Récursivement nettoie les enfants s'ils existent
  if (cleanNode.children) {
    cleanNode.children = cleanNode.children.map(child => cleanBookmarkTree(child));
  }

  return cleanNode;
}

export async function getTwitchBookmarks(): Promise<BookmarkNode[]> {
  try {
    const bookmarks = await browser.bookmarks.search({
      title: "TwitchOrganizer",
    });
    if (bookmarks.length > 0) {
      const folder = bookmarks[0];
      const subTree = await browser.bookmarks.getSubTree(folder.id);
      // Nettoie l'arbre avant de le retourner
      return subTree[0].children?.map(child => cleanBookmarkTree(child)) || [];
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
