import browser from "webextension-polyfill";

// Écouter les messages du script d'arrière-plan
browser.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse: (response: any) => void
) {
  if (
    request.text === "permissionsRead" ||
    request.text === "permissionsCRUD"
  ) {
    const checkboxesGlobalFactSheetConfiguration: NodeListOf<HTMLInputElement> =
      document.querySelectorAll(
        'lx-permissions-section-general-permissions input[type="checkbox"]'
      );
    for (let j = 0; j < checkboxesGlobalFactSheetConfiguration.length; j++) {
      let checkBoxValue =
        j === 1 || j === 5 || request.text === "permissionsCRUD";
      if (
        !checkboxesGlobalFactSheetConfiguration[j].disabled &&
        checkboxesGlobalFactSheetConfiguration[j].checked != checkBoxValue
      ) {
        console.log(
          `click value was ${checkboxesGlobalFactSheetConfiguration[j].checked} need to be ${checkBoxValue} on ${j}`
        );
        checkboxesGlobalFactSheetConfiguration[j].click();
        sendResponse(true);
      }
    }

    const manageContainer = function (containerTag: string) {
      const containers: NodeListOf<Element> =
        document.querySelectorAll(containerTag);
      // Parcourir tous les containers
      for (let i = 0; i < containers.length; i++) {
        let spanElement = containers[i].querySelector("span.itemLabel");
        let isComment =
          spanElement && spanElement.textContent?.trim() === "Comments";

        // Sélectionner toutes les cases à cocher dans le container courant
        const checkboxes: NodeListOf<HTMLInputElement> = containers[
          i
        ].querySelectorAll('input[type="checkbox"]');
        // Parcourir toutes les cases à cocher dans le container courant
        for (let j = 0; j < checkboxes.length; j++) {
          if (j !== 4) {
            let checkBoxValue =
              (isComment && j == 0) ||
              (isComment && j == 2) ||
              j === 1 ||
              j === 5 ||
              request.text === "permissionsCRUD";
            if (
              !checkboxes[j].disabled &&
              checkboxes[j].checked != checkBoxValue
            ) {
              console.log(
                `click value was ${checkboxes[j].checked} need to be ${checkBoxValue} on ${j}`
              );
              checkboxes[j].click();
              sendResponse(true);
              return true;
            }
          }
        }
      }
    };

    // if (manageContainer('lx-permissions-section-permission-item')) return;
    if (manageContainer("lx-permissions-section-permission-operations")) return;

    sendResponse(false);
  } else {
    // Vérifier si le curseur est dans un input
    let activeElement = document.activeElement;
    if (activeElement && activeElement.tagName.toLowerCase() === "input") {
      // Copier le contenu du message dans cet input
      let inputElement = activeElement as HTMLInputElement;
      inputElement.value = request.text;

      // Déclencher un événement 'input'
      let event = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }
});
