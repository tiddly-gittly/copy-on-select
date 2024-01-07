declare var exports: {
  startup: () => void;
  name: string;
  platforms: string[];
  after: string[];
  synchronous: boolean;
};

exports.name = 'copy-on-select';
exports.platforms = ['browser'];
exports.after = ['story'];
exports.synchronous = true;

exports.startup = function () {
  // we won't do copy on select on text editor, otherwise you can't select and override text in the editor or text input
  function checkIfElementIsEditor(element) {
    if (!element || !element.nodeName) return false;
    const isEditableElement = ['INPUT', 'TEXTAREA', 'BUTTON'].includes(element.nodeName);
    if (!isEditableElement) {
      if (!element.className || !element.className.toLowerCase) return false;
    }
    const isTextEditor = element.className.toLowerCase().includes('codemirror');
    const isSlateEditor = element.dataset.slateEditor || element.dataset.slateNode || element.dataset.slateLeaf || element.dataset.slateString;

    return isEditableElement || isTextEditor || isSlateEditor;
  }
  // if we start selection on editor, we prevent the following execution of this script
  let copyOnSelectPreventCopy = false;
  /** mousedown and wait for 1s to copy */
  let copyTimeoutNotDone = true;
  /** 0.6s */
  let copyTimeout = 0.6;
  let showNotification = true;
  const loadConfig = () => {
    copyTimeout = Number($tw.wiki.getTiddlerText('$:/config/linonetwo/copy-on-select/CopyTimeout', '1')) || 0.6;
    if (!isFinite(copyTimeout)) {
      copyTimeout = 0.6;
    }
    showNotification = $tw.wiki.getTiddlerText('$:/config/linonetwo/copy-on-select/ShowNotificationOnCopy') === 'yes';
  };
  let copyTimeoutHandler = 0;
  let copyReadyTimeoutHandler = 0;

  const cleanUp = () => {
    copyTimeoutNotDone = true;
    copyOnSelectPreventCopy = false;
    clearTimeout(copyTimeoutHandler);
    document.removeEventListener('mousemove', startCopyReadyCountDownCallback);
  };

  /**
   * remove the tailing \n when copying title
   * And display a notification
   */
  const copyTextModifier = (event) => {
    const selection = document.getSelection();
    let copiedText = selection.toString();
    if (copiedText.endsWith('\n')) {
      copiedText = copiedText.substring(0, copiedText.length - 1);
    }
    // if selection is empty, don't do anything
    if (!copiedText) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', copiedText);

    // DEBUG: console showNotification
    console.log(`showNotification`, showNotification);
    if (showNotification) {
      $tw.wiki.addTiddler({ title: '$:/state/notification/copy-on-select', text: `Copy\n\n${copiedText}` });
      $tw.notifier.display('$:/state/notification/copy-on-select');
      /** display copied text in notification */
      // const truncateLength = 30;
      // if (copiedText.length > truncateLength) {
      //   copiedText = `${copiedText.substring(0, 30)} ...`;
      // }
    }
  };
  /** Copy on select, copy document selection when mouse is down for a while */
  const onCopy = () => {
    /** NodeList from root html to current element, can't get selection info. So need to use `document.execCommand('copy')` instead of copy .innerText */
    const elementsUnderMouse = document.querySelectorAll(':hover');

    const copyPrevented =
      copyTimeoutNotDone || copyOnSelectPreventCopy || !elementsUnderMouse?.length || Array.from(elementsUnderMouse).some(checkIfElementIsEditor);
    if (copyPrevented) {
      return;
    }

    // this will only work for 2 times. On 3 times, it will not get called, no way around this.
    document.addEventListener('copy', copyTextModifier);
    /** $tw.utils.copyToClipboard(copiedText); can't copy image or html h1 format */
    // does not work on safari https://stackoverflow.com/questions/71340178/combination-of-document-addeventlistener-and-document-execcommandcopy-does-n/71372287#71372287
    document.execCommand('copy');
    document.removeEventListener('copy', copyTextModifier);
  };

  function startCopyReadyCountDown() {
    // when mouse move, reset the timeout, so we won't copy while user still selecting
    document.addEventListener('mousemove', startCopyReadyCountDownCallback);
  }
  function startCopyReadyCountDownCallback() {
    clearTimeout(copyTimeoutHandler);
    copyTimeoutHandler = setTimeout(onCopy, copyTimeout * 1000);
  }

  document.addEventListener('mousedown', () => {
    const elementsUnderMouse = document.querySelectorAll(':hover');

    if (!elementsUnderMouse?.length || Array.from(elementsUnderMouse).some(checkIfElementIsEditor)) {
      copyOnSelectPreventCopy = true;
    } else {
      copyOnSelectPreventCopy = false;
      // if hold mouse till copyTimeout, means timeout done, then "not done" is false
      copyTimeoutNotDone = false;
      loadConfig();
      startCopyReadyCountDown();
    }
  });

  document.addEventListener('mouseup', () => {
    cleanUp();
  });
};
