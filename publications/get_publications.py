import urllib.request
import json

# Replace with your 16-digit ORCID iD
ORCID_ID = "0000-0003-0302-182X" 

url = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"
req = urllib.request.Request(url, headers={"Accept": "application/json"})

with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

md_content = """---
title: "Publications"
subtitle: "Peer-reviewed journal articles and research outputs"
page-layout: article
toc: false
---

"""

works = data.get("group", [])

for work in works:
    summary = work.get("work-summary", [{}])[0]
    
    # Title
    title = summary.get("title", {}).get("title", {}).get("value", "Untitled")
    
    # Year
    pub_date = summary.get("publication-date") or {}
    year = pub_date.get("year", {}).get("value", "n.d.") if pub_date else "n.d."
    
    # Journal / Venue
    journal = summary.get("journal-title", {}).get("value", "") if summary.get("journal-title") else ""
    venue_str = f"*{journal}*" if journal else "*Publication*"
    
    # DOI / URL
    doi = ""
    ext_ids = summary.get("external-ids", {}).get("external-id", [])
    for ext_id in ext_ids:
        if ext_id.get("external-id-type") == "doi":
            doi = ext_id.get("external-id-value")
            break
            
    link_str = f" [[DOI](https://doi.org/{doi})]" if doi else ""
    
    # Format entry
    md_content += f"* **{title}**  \n  {venue_str} ({year}){link_str}\n\n---\n\n"

with open("publications.qmd", "w", encoding="utf-8") as f:
    f.write(md_content)

print("Successfully updated publications.qmd!")