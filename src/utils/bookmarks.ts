import browser from "webextension-polyfill";
import { devBookmarks } from "@/config/dev.bookmarks";
import { BookmarkNode } from "@/types/bookmark";

function cleanBookmarkTree(node: BookmarkNode): BookmarkNode {
  const cleanNode = { ...node };

  // Enlève "- Twitch" du titre
  if (cleanNode.title) {
    cleanNode.title = cleanNode.title.replace(/\s*-\s*Twitch$/i, "");
  }
  // Nettoie le titre et extrait le nom du streameur si nécessaire
  if (cleanNode.url) {
    // Essaie de trouver un nom de streameur dans l'URL
    const twitchMatch = cleanNode.url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
    if (twitchMatch) {
      const streamerName = twitchMatch[1];
      if (
        cleanNode.title.toLocaleLowerCase() !== streamerName.toLocaleLowerCase()
      ) {
        cleanNode.title = streamerName;
      }
    }
  }

  // Récursivement nettoie les enfants
  if (cleanNode.children) {
    cleanNode.children = cleanNode.children.map((child) =>
      cleanBookmarkTree(child)
    );
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
      return (
        subTree[0].children?.map((child) => cleanBookmarkTree(child)) || []
      );
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
  }
  const bookmark = await browser.bookmarks.create(bookmarkData);

  if (node.children) {
    for (const child of node.children) {
      await createBookmarkTree(child, bookmark.id);
    }
  }
}
