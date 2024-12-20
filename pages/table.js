
const tableHead = [
    { "name": "Detection Name", "id": "filterDetectionName" },
    { "name": "MITRE Tactic", "id": "filterTactic" },
    { "name": "MITRE Technique/ Sub-technique", "id": "filterTechnique" },
    { "name": "Platform", "id": "filterPlatform" },
    { "name": "CVE", "id": "filterCVE" },
    { "name": "MITRE Defend", "id": "filterMITREDefend" },
    { "name": "Mitigation", "id": "filterMitigation" },
    { "name": "NIST", "id": "filterNIST" },
    { "name": "CIST", "id": "filterCIST" }
];

function generateTableHead() {
    const thead = document.getElementById('detectionTableHead');
    const tr = document.createElement('tr');

    tableHead.forEach(item => {
        const th = document.createElement('th');


        th.textContent = item.name;


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
    populateFilters();
}

const data = [
    {
        detectionname: "Example Detection",
        tactic: "Initial Access",
        technique: "Phishing (T1566)",
        platform: "Windows",
        cve: "CVE-2023-12345",
        mitredefend: "Monitor Email Traffic",
        mitigation: "Employee Training",
        nist: "SP 800-53",
        cist: "4.1.1"
    },
    {
        detectionname: "Another Detection",
        tactic: "Execution",
        technique: "PowerShell (T1059.001)",
        platform: "Linux",
        cve: "CVE-2023-67890",
        mitredefend: "Command Line Auditing",
        mitigation: "Patch Management",
        nist: "SP 800-171",
        cist: "4.2.2"
    }
];

function renderTable() {
    const tableBody = document.getElementById('detectionTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        const row = document.createElement('tr');

        const detectionNameCell = document.createElement('td');
        const link = document.createElement('a');
        link.textContent = item.detectionname;
        link.href = `/pages/knowledgeBase.html#/${i}`;
        detectionNameCell.appendChild(link);
        // detectionNameCell.textContent = item.detectionname;

        const tacticCell = document.createElement('td');
        tacticCell.textContent = item.tactic;

        const techniqueCell = document.createElement('td');
        techniqueCell.textContent = item.technique;

        const platformCell = document.createElement('td');
        platformCell.textContent = item.platform;

        const cveCell = document.createElement('td');
        cveCell.textContent = item.cve;

        const mitreDefendCell = document.createElement('td');
        mitreDefendCell.textContent = item.mitredefend;

        const mitigationCell = document.createElement('td');
        mitigationCell.textContent = item.mitigation;

        const nistCell = document.createElement('td');
        nistCell.textContent = item.nist;

        const cistCell = document.createElement('td');
        cistCell.textContent = item.cist;

        row.appendChild(detectionNameCell);
        row.appendChild(tacticCell);
        row.appendChild(techniqueCell);
        row.appendChild(platformCell);
        row.appendChild(cveCell);
        row.appendChild(mitreDefendCell);
        row.appendChild(mitigationCell);
        row.appendChild(nistCell);
        row.appendChild(cistCell);

        tableBody.appendChild(row);
    };
}


function populateFilters() {
    const filterKeys = [
        'DetectionName', 'Tactic', 'Technique', 'Platform', 'CVE',
        'MITREDefend', 'Mitigation', 'NIST', 'CIST'
    ];

    filterKeys.forEach(key => {
        const selectElement = document.getElementById(`filter${key}`);
        if (selectElement.id === 'filterDetectionName') {
            selectElement.style.display = 'none';
        }
        const uniqueValues = [...new Set(data.map(item => item[key.toLowerCase()]))];
        selectElement.innerHTML = '<option value="">All</option>';

        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    });
    renderTable();
}
generateTableHead();


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
        cist: document.getElementById('filterCIST').value.toLowerCase()
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
            cist: cells[8]?.innerText.toLowerCase()
        };
        const matchesFilters = Object.keys(filters).every((filter) => {
            return !filters[filter] || (rowData[filter]?.includes(filters[filter].trim()));
        });


        rows[i].style.display = matchesFilters ? '' : 'none';
    }
}
