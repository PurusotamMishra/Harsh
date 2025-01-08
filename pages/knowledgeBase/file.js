
var fileNames = [];
var hashedDigit = -1

function createKnowledgeBaseHTML() {
    const container = document.createElement('div');
    container.id = 'container';

    const fileLists = document.createElement('div');
    fileLists.id = 'knowledge-base-file-lists';

    const fileListsTitle = document.createElement('h3');
    const fileListLink = document.createElement('a');
    fileListLink.textContent = 'Detection Files';
    fileListLink.href = '/pages/home/index.html'
    fileListsTitle.appendChild(fileListLink);

    const fileList = document.createElement('ul');
    fileList.id = 'file-list';

    fileLists.appendChild(fileListsTitle);
    fileLists.appendChild(fileList);

    const fileContent = document.createElement('div');
    fileContent.id = 'knowledge-base-file-content';

    const fileTitle = document.createElement('h2');
    fileTitle.id = 'knowledge-base-file-title';

    const detectionNameTitle = document.createElement('h3');
    detectionNameTitle.textContent = 'Detection Name';

    const detectionName = document.createElement('p');
    detectionName.id = 'knowledge-base-detection-name';

    const descriptionTitle = document.createElement('h3');
    descriptionTitle.textContent = 'Description';

    const description = document.createElement('p');
    description.id = 'knowledge-base-description';

    const annotationsTitle = document.createElement('h3');
    annotationsTitle.textContent = 'Annotations';

    const annotationsList = document.createElement('ul');
    annotationsList.id = 'knowledge-base-annotations';

    const typeTitle = document.createElement('h3');
    typeTitle.textContent = 'Type';

    const type = document.createElement('p');
    type.id = 'knowledge-base-type';
    type.textContent = 'TTP (Tactics, Techniques, and Procedures)';

    const loggingRequiredTitle = document.createElement('h3');
    loggingRequiredTitle.textContent = 'Logging Required';

    const loggingRequiredList = document.createElement('ul');
    loggingRequiredList.id = 'knowledge-base-logging-required';

    const recommendedActionsTitle = document.createElement('h3');
    recommendedActionsTitle.textContent = 'Recommended Actions';

    const recommendedActionsList = document.createElement('ul');
    recommendedActionsList.id = 'knowledge-base-recommended-actions';

    const considerationsTitle = document.createElement('h3');
    considerationsTitle.textContent = 'Considerations';

    const considerationsList = document.createElement('ul');
    considerationsList.id = 'knowledge-base-considerations';

    const mitigationsTitle = document.createElement('h3');
    mitigationsTitle.textContent = 'Mitigation';

    const mitigationsList = document.createElement('ul');
    mitigationsList.id = 'knowledge-base-mitigations';

    const referencesTitle = document.createElement('h3');
    referencesTitle.textContent = 'References:';

    const referencesList = document.createElement('ul');
    referencesList.id = 'knowledge-base-references';

    fileContent.appendChild(fileTitle);
    fileContent.appendChild(detectionNameTitle);
    fileContent.appendChild(detectionName);
    fileContent.appendChild(descriptionTitle);
    fileContent.appendChild(description);
    fileContent.appendChild(annotationsTitle);
    fileContent.appendChild(annotationsList);
    fileContent.appendChild(typeTitle);
    fileContent.appendChild(type);
    fileContent.appendChild(loggingRequiredTitle);
    fileContent.appendChild(loggingRequiredList);
    fileContent.appendChild(recommendedActionsTitle);
    fileContent.appendChild(recommendedActionsList);
    fileContent.appendChild(considerationsTitle);
    fileContent.appendChild(considerationsList);
    fileContent.appendChild(mitigationsTitle);
    fileContent.appendChild(mitigationsList);
    fileContent.appendChild(referencesTitle);
    fileContent.appendChild(referencesList);

    const errorMsg = document.createElement('div');
    errorMsg.id = 'error-msg';

    container.appendChild(fileLists);
    container.appendChild(fileContent);

    document.body.appendChild(container);
    document.body.appendChild(errorMsg);
    fetchFileNames();
}

function didMount() {
    document.body.innerHTML = `
<div id="container">
<div id="knowledge-base-file-lists">
    <h3><a href="/pages/home/index.html">Detection Files</a></h3>
    <ul id="file-list"></ul>
</div>
<div id="knowledge-base-file-content">
    <h2 id="knowledge-base-file-title"></h2>
    <h3>Detection Name</h3>
    <p id="knowledge-base-detection-name"></p>
    <h3>Description</h3>
    <p id="knowledge-base-description"></p>
    <h3>Annotations</h3>
    <ul id="knowledge-base-annotations"></ul>
    <h3>Type</h3>
    <p id="knowledge-base-type">TTP (Tactics, Techniques, and Procedures)</p>
    <h3>Logging Required</h3>
    <ul id="knowledge-base-logging-required"></ul>
    <h3>Recommended Actions</h3>
    <ul id="knowledge-base-recommended-actions"></ul>
    <h3>Considerations</h3>
    <ul id="knowledge-base-considerations"></ul>
    <h3>Mitigation</h3>
    <ul id="knowledge-base-mitigations"></ul>
    <h3>References:</h3>
    <ul id="knowledge-base-references"></ul>
</div>
</div>
<div id="error-msg"></div>
`;
    fetchFileNames();
}

window.onload = () => {
    didMount();
}


var contentDiv = document.getElementById("error-msg");
var fileListElement = document.getElementById('file-list');
async function fetchFileNames() {
    contentDiv = document.getElementById("error-msg");
    fileListElement = document.getElementById('file-list');
    const response = await fetch(`/harsh/assets/detectionFiles.json`);
    fileNames = await response.json();
    fileNames.forEach((file, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/pages/knowledgeBase/knowledgeBase.html#/${index}`
        a.textContent = file;
        li.appendChild(a);
        // li.onclick = function () {
        //     document.getElementById("container").innerHTML = "";
        // };
        fileListElement.appendChild(li);
    });
    loadContentFromHash();
}

function loadContentFromHash() {
    const hash = window.location.hash;


    if (hash) {
        if (hash === "") {
            contentDiv.innerHTML = `# This is empty hash content the content`;
        } else if (/^\d+$/.test(hash.split('#/')[1])) {
            hashedDigit = parseInt(hash.split('#/')[1]);
            fetchJSONFiles(fileNames[hashedDigit])
        } else {
            contentDiv.innerHTML = `# Unknown Hash
                                    This hash is not mapped to any content.`;
        }
    } else {
        contentDiv.innerHTML = `# Welcome No hash provided. Displaying default content.`;
    }
}

window.addEventListener('hashchange', () => {
    document.body.innerHTML = '';
    createKnowledgeBaseHTML();
});
async function fetchJSONFiles(fileName) {
    const response = await fetch(`/harsh/assets/detectionFiles/${fileName}`);
    const data = await response.json();

    var fileTitle = document.getElementById("knowledge-base-file-title");
    fileTitle.innerText = data['Detection Name'];

    var fileTitle = document.getElementById("knowledge-base-file-title");
    fileTitle.innerText = data['Detection Name'];

    var detectionName = document.getElementById("knowledge-base-detection-name");
    detectionName.innerText = data['Detection Name'];

    var detectionDesc = document.getElementById("knowledge-base-description");
    detectionDesc.innerText = data['Description'];


    var detectionLog = document.getElementById("knowledge-base-logging-required");
    data['Logging Required'].forEach(log => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        p.textContent = log;
        li.appendChild(p);
        detectionLog.appendChild(li);
    });

    var detectionRecommended = document.getElementById("knowledge-base-recommended-actions");
    data['Recommended Actions'].forEach(log => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        p.textContent = log;
        li.appendChild(p);
        detectionRecommended.appendChild(li);
    });

    var detectionConsiderations = document.getElementById("knowledge-base-considerations");
    data.Considerations.forEach(log => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        p.textContent = log;
        li.appendChild(p);
        detectionConsiderations.appendChild(li);
    });

    var detectionReferences = document.getElementById("knowledge-base-references");
    data.References.forEach(log => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        p.textContent = log;
        li.appendChild(p);
        detectionReferences.appendChild(li);
    });

    var detectionAnnotations = document.getElementById("knowledge-base-annotations");
    data.Annotations.forEach(item => {
        const li = document.createElement('li');

        const key = Object.keys(item)[0];
        const value = item[key];

        var strong = document.createElement('strong');
        strong.textContent = key + ": ";
        li.appendChild(strong);
        if (['string', 'number'].includes(typeof value)) {
            li.appendChild(document.createTextNode(value));
        } else {
            let arr = [];
            value.forEach(subItem => {
                if (['string', 'number'].includes(typeof subItem)) {
                    arr.push(subItem);
                    // li.appendChild(document.createTextNode(subItem));
                    // li.appendChild(document.createTextNode(" "));
                } else {
                    const a = document.createElement('a');
                    if (subItem.URL && subItem.URL !== 'None' && subItem.URL !== 'NONE') {
                        a.href = subItem.URL;
                    }
                    a.textContent = subItem[key] || subItem[key.replace(/.*\./, '')];
                    a.target = "_blank";
                    li.appendChild(a);
                    li.appendChild(document.createTextNode(' '));
                }
            });
            if(arr.length>0){
                li.appendChild(document.createTextNode(arr.join(', ')))
            }
        }

        detectionAnnotations.appendChild(li);
    });

    var detectionMitigations = document.getElementById("knowledge-base-mitigations");
    data.Mitigation.forEach(log => {
        const a = document.createElement('a');
        if (log.URL && log.URL !== 'None' && log.URL !== 'NONE') {
            a.href = log.URL;
        }
        a.textContent = log.Mitigation;
        a.target = "_blank";
        const li = document.createElement("li");
        li.appendChild(a);
        li.appendChild(document.createTextNode(' '));
        detectionMitigations.appendChild(li);
    });

}

// fetchFileNames();
