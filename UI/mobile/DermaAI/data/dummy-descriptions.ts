import { Description } from "@/types/description";

const descriptions: Description[] = [
  {
    lessionType: "Melanoma",
    overview: `
Melanoma is a serious type of skin cancer.

**Warning signs:**
- Irregular borders
- Varied colors
- Rapid changes in size

| Stage | Treatment   |
|-------|-------------|
| I     | Surgery     |
| II    | Chemotherapy|
`,
    details: `

# Melanoma: A Detailed Overview

## What is Melanoma?

**Melanoma** is a serious form of **skin cancer** that develops in the **melanocytes**, the cells that produce melanin—the pigment that gives skin its color. While less common than other skin cancers (like basal cell carcinoma and squamous cell carcinoma), melanoma is far more dangerous because of its ability to **metastasize** (spread) to other parts of the body if not caught and treated early.

## Causes and Risk Factors

The primary cause of melanoma is intense, intermittent exposure to **ultraviolet (UV) radiation** from sunlight and tanning beds. UV radiation damages the DNA in skin cells, leading to uncontrolled cellular growth.

Key risk factors include:

*   **UV Exposure:** A history of sunburns, especially blistering sunburns in childhood or adolescence.
*   **Fair Skin:** Less melanin means less protection from UV radiation. Those with light skin, freckles, light hair (blond or red), and light-colored eyes are at higher risk.
*   **Moles (Nevi):** Having a large number of moles (especially >50) or atypical moles (dysplastic nevi).
*   **Personal or Family History:** A previous melanoma or a family history of the disease increases risk.
*   **Weakened Immune System:** Individuals with suppressed immune systems (e.g., from organ transplants, HIV/AIDS) are at higher risk.
*   **Age & Gender:** While more common in older adults, it is one of the most common cancers in young adults (especially young women).

## Types of Melanoma

*   **Superficial Spreading Melanoma:** The most common type (~70%). It grows outward along the top layer of skin before penetrating deeper.
*   **Nodular Melanoma:** The most aggressive type (~15%). It grows downward deeper into the skin rapidly and often appears as a raised bump, usually blue-black or red.
*   **Lentigo Maligna Melanoma:** Common in older adults on sun-damaged skin (face, ears, arms). It begins as a flat, mottled, tan/ brown patch (lentigo maligna) and grows slowly before invading deeper.
*   **Acral Lentiginous Melanoma:** The most common type in people with darker skin tones. It appears on areas not often exposed to sun, like under the nails (subungual), on the palms of hands, or soles of feet.
*   **Amelanotic Melanoma:** A rare, unpigmented form that appears pink, red, or flesh-colored, making it harder to detect.

## Diagnosis

1.  **Skin Examination:** A dermatologist examines the suspicious lesion and the rest of your skin.
2.  **Dermatoscopy:** A handheld device (dermatoscope) that magnifies and illuminates the skin, allowing for a more detailed view of structures within a mole.
3.  **Biopsy:** If a lesion is suspicious, the entire lesion or a part of it will be surgically removed and sent to a lab for analysis. This is the only definitive way to diagnose melanoma. Types of biopsies include punch, excisional, and incisional.

## Staging

If melanoma is confirmed, it is staged to determine its severity and guide treatment. The most common system is the **Breslow's thickness** (how deep the tumor has penetrated the skin) and the **TNM system** (Tumor, Nodes, Metastasis).

*   **Stage 0 (Melanoma in situ):** Confined to the epidermis.
*   **Stage I & II:** Localized, deeper tumors but no spread.
*   **Stage III:** Spread to nearby lymph nodes.
*   **Stage IV:** Metastasized to distant organs (lungs, liver, brain, etc.).

## Treatment Options

Treatment depends on the stage and location of the melanoma.

*   **Surgery:** The primary treatment for early-stage melanoma. Involves wide excision to remove the tumor and a margin of healthy tissue around it.
*   **Sentinel Lymph Node Biopsy (SLNB):** Performed to determine if the cancer has spread to the lymphatic system.
*   **Lymph Node Dissection:** Removal of regional lymph nodes if cancer is found.
*   **Immunotherapy:** Uses drugs to boost the patient's own immune system to fight the cancer. (e.g., checkpoint inhibitors like pembrolizumab, nivolumab).
*   **Targeted Therapy:** Uses drugs that target specific genetic mutations (like BRAF) found in cancer cells.
*   **Radiation Therapy:** Uses high-energy beams to kill cancer cells, often used after lymph node surgery or to treat metastatic sites.
*   **Chemotherapy:** Less common now due to immunotherapy and targeted therapy, but may be used in advanced cases.

## Prevention

*   **Use Sunscreen:** Broad-spectrum SPF 30 or higher, every day, even when cloudy. Reapply every two hours, or after swimming/sweating.
*   **Seek Shade:** Especially between 10 a.m. and 4 p.m. when the sun's rays are strongest.
*   **Wear Protective Clothing:** Hats, sunglasses, and long-sleeved shirts.
*   **Avoid Tanning Beds:** They emit harmful UV radiation and significantly increase risk.
*   **Perform Regular Self-Exams:** Know your skin and your moles. Use a mirror to check hard-to-see areas.
*   **Get Professional Skin Checks:** See a dermatologist annually for a full-body skin exam, or more frequently if you are high-risk.

## Prognosis

The prognosis for melanoma is highly dependent on **early detection**. When detected and treated early (Stages 0-II), the 5-year survival rate is over **98%**. This drops significantly if the cancer metastasizes. Regular self-exams and professional check-ups are critical.

***
**Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice. If you have concerns about a mole or spot on your skin, please consult a dermatologist or healthcare provider immediately.
    `,
    advice: `

**Catch it early, it's a game-changer.**

*   **Know Your ABCDEs:** Check your skin monthly for moles that are **A**symmetrical, have irregular **B**orders, multiple **C**olors, a large **D**iameter, or are **E**volving.
*   **See a Spot, See a Doc:** Any new, changing, or unusual mole needs an immediate professional check. Don't wait.
*   **Sun Safety is Key:** Use broad-spectrum SPF 30+, seek shade, and avoid tanning beds. Prevention is your best defense.

**Early detection saves lives.**
- Avoid sun exposure
- Regular check-ups
- Report new lesions
    `
  }
];

export default descriptions;
