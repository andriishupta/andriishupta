const siteOrigin = "https://andriishupta.dev";

const toLocalImageUrl = (value) =>
  typeof value === "string" && value.startsWith(`${siteOrigin}/images/`)
    ? value.slice(siteOrigin.length)
    : value;

const rewriteImages = (node) => {
  if (node.type === "image") {
    node.url = toLocalImageUrl(node.url);
  }

  if (Array.isArray(node.attributes)) {
    for (const attribute of node.attributes) {
      if (attribute.name === "src") {
        attribute.value = toLocalImageUrl(attribute.value);
      }
    }
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      rewriteImages(child);
    }
  }
};

export function remarkLocalImages() {
  return rewriteImages;
}
