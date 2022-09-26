/* global browser */

let multipleHighlighted = false;

browser.browserAction.onClicked.addListener( async (refocusTab) => {
    if(multipleHighlighted){
        for(const t of await browser.tabs.query({currentWindow:true, highlighted: true})){
            await browser.tabs.duplicate(t.id);
        }
    }else{
        // only duplicate the acitve Tab
        await browser.tabs.duplicate(refocusTab.id);
    }
    browser.tabs.highlight({ tabs: [refocusTab.index] });
});

browser.menus.create({
	title: "Duplicate Tabs (in BG)",
	contexts: ["tab"],
	onclick: async (info, tab) => {
        const refocusTab = (await browser.tabs.query({currentWindow:true, active:true}))[0];
        if(multipleHighlighted){
            for(const t of await browser.tabs.query({currentWindow:true, highlighted: true})){
                await browser.tabs.duplicate(t.id);
            }
        }else{
            // only duplicate the clicked tab
            await browser.tabs.duplicate(tab.id);
        }
        browser.tabs.highlight({ tabs: [refocusTab.index] });
	}
});

function handleHighlighted(highlightInfo) {
    multipleHighlighted = (highlightInfo.tabIds.length > 1);
}

browser.tabs.onHighlighted.addListener(handleHighlighted);

