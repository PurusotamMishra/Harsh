
const tableHead = [
    { "name": "Detection Name", "id": "filterDetectionName" },
    { "name": "MITRE Tactic", "id": "filterTactic" },
    { "name": "MITRE Technique/ Sub-technique", "id": "filterTechnique" },
    { "name": "Platform", "id": "filterPlatform" },
    { "name": "CVE", "id": "filterCVE" },
    { "name": "MITRE Defend", "id": "filterMITREDefend" },
    { "name": "Mitigation", "id": "filterMitigation" },
    { "name": "NIST", "id": "filterNIST" },
    { "name": "CIS", "id": "filterCIS" },
    { "name": "Group", "id": "filterGroup" },
    { "name": "Campaign", "id": "filterCampaign" },
    { "name": "Software", "id": "filterSoftware" },
    { "name": "Agent", "id": "filterAgent" },

];

var fileNames = [];
var TableContents = [];
var filterTableContents = [];

async function fetchAllFilesContents(fileNames) {
    for (let i = 0; i < fileNames.length; i++) {
        const response = await fetch(`/assets/detectionFiles/${fileNames[i]}`);
        const data = await response.json();
        const result = {
            "detectionname": data["Detection Name"],
            "tactic": data.Annotations.find(annotation => annotation.Tactic)?.Tactic || null,
            "technique": (() => {
                const subTechnique = data.Annotations.find(annotation => annotation["Sub-Technique"])?.["Sub-Technique"];
                const technique = data.Annotations.find(annotation => annotation.Technique)?.Technique;
                if (subTechnique && subTechnique !== '-') return subTechnique;
                return technique || null;
            })(),
            "platform": data.Annotations.find(annotation => annotation.Platform)?.Platform || null,
            "cve": data.Annotations.find(annotation => annotation.CVE)?.CVE || null,
            "mitredefend": data.Annotations.find(annotation => annotation.D3FEND)?.D3FEND || null,
            "mitigation": data.Mitigation || null,
            "nist": data.Annotations.find(annotation => annotation.NIST)?.NIST || null,
            "cis": data.Annotations.find(annotation => annotation.CIS)?.CIS || null,
            "group": data.Annotations.find(annotation => annotation.Group)?.Group || null,
            "campaign": data.Annotations.find(annotation => annotation.Campaign)?.Campaign || null,
            "software": data.Annotations.find(annotation => annotation.Software)?.Software || null,
            "agent": data.Annotations.find(annotation => annotation.Agent)?.Agent || null
        };
        TableContents.push(result);
    }
    generateTableHead();
}

async function fetchFileNames() {
    const response = await fetch(`/assets/detectionFiles.json`);
    fileNames = await response.json();
    fetchAllFilesContents(fileNames);
}


function generateTableHead() {
    const thead = document.getElementById('detectionTableHead');
    const tr = document.createElement('tr');

    tableHead.forEach(item => {
        const th = document.createElement('th');
        const span = document.createElement('span')
        span.textContent = item.name;
        th.appendChild(span)
        const select = document.createElement('select');
        select.id = item.id;
        select.setAttribute('onchange', 'filterTable()');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'All';
        select.appendChild(defaultOption);
        th.appendChild(select);
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    renderTable();
}

function renderTable() {
    const tableBody = document.getElementById('detectionTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    for (let i = 0; i < TableContents.length; i++) {
        const item = TableContents[i];
        let tempFilter = {};

        const row = document.createElement('tr');

        const detectionNameCell = document.createElement('td');
        const link = document.createElement('a');
        link.textContent = item.detectionname;
        link.href = `/pages/knowledgeBase/knowledgeBase.html#/${i}`;
        detectionNameCell.appendChild(link);
        tempFilter.detectionname = item.detectionname?.toLowerCase();

        const tacticCell = document.createElement('td');
        const tacticDiv = document.createElement('div');
        tacticDiv.textContent = item.tactic;
        tempFilter.tactic = item.tactic?.toLowerCase();
        tacticCell.appendChild(tacticDiv)

        const techniqueCell = document.createElement('td');
        const techniqueDiv = document.createElement('div');
        techniqueDiv.textContent = item.technique;
        tempFilter.technique = item.technique?.toLowerCase();
        techniqueCell.appendChild(techniqueDiv);

        const platformCell = document.createElement('td');
        platformCell.textContent = item.platform?.join(", ");
        tempFilter.platform = []
        item.platform?.forEach(subItem => {
            tempFilter.platform?.push(subItem?.toLowerCase())
        })

        const cveCell = document.createElement('td');
        cveCell.textContent = item.cve;
        tempFilter.cve = item.cve?.toLowerCase();

        const mitreDefendCell = document.createElement('td');
        const mitreDefendDiv = document.createElement('div');
        tempFilter.mitredefend = [];
        item.mitredefend?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.D3FEND;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                mitreDefendDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.D3FEND;
                mitreDefendDiv.appendChild(subItemLink);
            }
            tempFilter.mitredefend?.push(subItem.D3FEND?.toLowerCase());
        });
        mitreDefendDiv.className = "multiValues";
        mitreDefendCell.appendChild(mitreDefendDiv);

        const mitigationCell = document.createElement('td');
        const mitigationDiv = document.createElement('div');
        tempFilter.mitigation = [];
        item.mitigation?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Mitigation;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                mitigationDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Mitigation;
                mitigationDiv.appendChild(subItemLink);
            }
            tempFilter.mitigation.push(subItem.Mitigation?.toLowerCase())
        });
        mitigationDiv.className = "multiValues";
        mitigationCell.appendChild(mitigationDiv);

        const nistCell = document.createElement('td');
        const nistDiv = document.createElement('div');
        tempFilter.nist = [];
        item.nist?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.NIST;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                nistDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.NIST;
                nistDiv.appendChild(subItemLink);
            }
            tempFilter.nist?.push(subItem.NIST?.toLowerCase())
        });
        nistDiv.className = "multiValues";
        nistCell.appendChild(nistDiv);

        const cisCell = document.createElement('td');
        const cisDiv = document.createElement('div');
        tempFilter.cis = [];
        item.cis?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.CIS;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                cisDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.CIS;
                cisDiv.appendChild(subItemLink);
            }
            tempFilter.cis.push(subItem.CIS?.toLowerCase())
        });
        cisDiv.className = 'multiValues';
        cisCell.appendChild(cisDiv);

        const groupCell = document.createElement('td');
        const groupDiv = document.createElement('div');
        tempFilter.group = [];
        item.group?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Group;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                groupDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Group;
                groupDiv.appendChild(subItemLink);
            }
            tempFilter.group.push(subItem.Group?.toLowerCase())
        });
        groupDiv.className = 'multiValues';
        groupCell.appendChild(groupDiv);

        const campaignCell = document.createElement('td');
        const campaignDiv = document.createElement('div');
        tempFilter.campaign = [];
        item.campaign?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Campaign;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                campaignDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Campaign;
                campaignDiv.appendChild(subItemLink);
            }
            tempFilter.campaign.push(subItem.Campaign?.toLowerCase())
        });
        campaignDiv.className = 'multiValues';
        campaignCell.appendChild(campaignDiv);

        const softwareCell = document.createElement('td');
        const softwareDiv = document.createElement('div');
        tempFilter.software = [];
        item.software?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Software;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                softwareDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Software;
                softwareDiv.appendChild(subItemLink);
            }
            tempFilter.software.push(subItem.Software?.toLowerCase())
        });
        softwareDiv.className = 'multiValues';
        softwareCell.appendChild(softwareDiv);


        const agentCell = document.createElement('td');
        const agentDiv = document.createElement('div');
        tempFilter.agent = [];
        item.agent?.forEach(subItem => {
            if (subItem.URL && subItem.URL !== 'None') {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Agent;
                subItemLink.href = subItem.URL;
                subItemLink.target = '_blank';
                agentDiv.appendChild(subItemLink);
            } else {
                const subItemLink = document.createElement('a');
                subItemLink.textContent = subItem.Agent;
                agentDiv.appendChild(subItemLink);
            }
            tempFilter.agent.push(subItem.Agent?.toLowerCase())
        });
        agentDiv.className = 'multiValues';
        agentCell.appendChild(agentDiv);

        row.appendChild(detectionNameCell);
        row.appendChild(tacticCell);
        row.appendChild(techniqueCell);
        row.appendChild(platformCell);
        row.appendChild(cveCell);
        row.appendChild(mitreDefendCell);
        row.appendChild(mitigationCell);
        row.appendChild(nistCell);
        row.appendChild(cisCell);
        row.appendChild(groupCell);
        row.appendChild(campaignCell);
        row.appendChild(softwareCell);
        row.appendChild(agentCell);

        tableBody.appendChild(row);
        filterTableContents = filterTableContents.concat(tempFilter);
    };
    populateFilters();
}


function populateFilters() {
    const filterKeys = [
        'DetectionName', 'Tactic', 'Technique', 'Platform', 'CVE',
        'MITREDefend', 'Mitigation', 'NIST', 'CIS', 'Group', 'Campaign', 'Software', 'Agent'
    ];

    const uniqueValues = {};
    TableContents.forEach(obj => {
        for (const [key, value] of Object.entries(obj)) {
            if (['string', 'number'].includes(typeof value)) {
                uniqueValues[key] = uniqueValues[key] || [];
                if (!uniqueValues[key].includes(value)) {
                    uniqueValues[key].push(value);
                }
            } else {
                if (value && value.every(v => typeof v === 'string')) {
                    uniqueValues[key] = [
                        ...(uniqueValues[key] || []),
                        ...value
                    ].filter((v, i, arr) => arr.indexOf(v) === i);
                } else if (value) {
                    let valueArr = []
                    value.forEach(item => valueArr.push(Object.values(item)[0]))
                    uniqueValues[key] = [
                        ...(uniqueValues[key] || []),
                        ...valueArr
                    ].filter((v, i, arr) => arr.indexOf(v) === i);
                }
            }
        }
    });

    for (const key in uniqueValues) {
        if (Array.isArray(uniqueValues[key])) {
            uniqueValues[key] = uniqueValues[key].filter(value => value !== null && value !== undefined && value !== '-');
        }
    }

    filterKeys.forEach(key => {
        const selectElement = document.getElementById(`filter${key}`);
        if (selectElement.id === 'filterDetectionName') {
            selectElement.style.display = 'none';
        }
        selectElement.innerHTML = '<option value="">All</option>';
        let value = uniqueValues[key.toLowerCase()]
        if (['string', 'number'].includes(typeof value)) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        } else if (typeof value === 'object') {
            value.forEach(subItem => {
                if (['number', 'string'].includes(typeof subItem)) {
                    const option = document.createElement('option');
                    option.value = subItem;
                    option.textContent = subItem;
                    selectElement.appendChild(option);
                } else {
                    const option = document.createElement('option');
                    option.value = Object.values(subItem)[0];
                    option.textContent = Object.values(subItem)[0];
                    selectElement.appendChild(option);
                }
            });
        }
    });
}


function filterTable() {
    const filters = {
        detectionName: document.getElementById('filterDetectionName').value.toLowerCase(),
        tactic: document.getElementById('filterTactic').value.toLowerCase(),
        technique: document.getElementById('filterTechnique').value.toLowerCase(),
        platform: document.getElementById('filterPlatform').value.toLowerCase(),
        cve: document.getElementById('filterCVE').value.toLowerCase(),
        mitreDefend: document.getElementById('filterMITREDefend').value.toLowerCase(),
        mitigation: document.getElementById('filterMitigation').value.toLowerCase(),
        nist: document.getElementById('filterNIST').value.toLowerCase(),
        cis: document.getElementById('filterCIS').value.toLowerCase(),
        group: document.getElementById('filterGroup').value.toLowerCase(),
        software: document.getElementById('filterSoftware').value.toLowerCase(),
        campaign: document.getElementById('filterCampaign').value.toLowerCase(),
        agent: document.getElementById('filterAgent').value.toLowerCase()
    };

    const table = document.getElementById('detectionTableBody');
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const rowData = {
            detectionName: cells[0]?.innerText.toLowerCase(),
            tactic: cells[1]?.innerText.toLowerCase(),
            technique: cells[2]?.innerText.toLowerCase(),
            platform: cells[3]?.innerText.toLowerCase(),
            cve: cells[4]?.innerText.toLowerCase(),
            mitreDefend: cells[5]?.innerText.toLowerCase(),
            mitigation: cells[6]?.innerText.toLowerCase(),
            nist: cells[7]?.innerText.toLowerCase(),
            cis: cells[8]?.innerText.toLowerCase(),
            group: cells[9]?.innerText.toLowerCase(),
            software: cells[10]?.innerText.toLowerCase(),
            campaign: cells[11]?.innerText.toLowerCase(),
            agent: cells[12]?.innerText.toLowerCase()
        };
        // console.log(rowData)
        // console.log(filterTableContents[i])
        // console.log(filters)

        const matchesFilters = Object.keys(filters).every((filter) => {
            return !filters[filter] || (filterTableContents[i][filter]?.includes(filters[filter].trim()));
        });
        const inputValueOfSearch = document.getElementById('keywordSearch').value.toLowerCase();
        const filterBySearchInput = JSON.stringify(Object.values(filterTableContents[i])).includes(inputValueOfSearch)

        rows[i].style.display = inputValueOfSearch ?
            filterBySearchInput && matchesFilters ?
                '' : 'none'
            : matchesFilters ? '' : 'none';
    }
}

window.onload = function () {
    fetchFileNames();
};
