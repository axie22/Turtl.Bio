import { NextResponse } from 'next/server';

const AI_RESPONSES = [
  "The preclinical toxicology data suggests a potential signal in the hepatic panel. We should cross-reference this with the 21 CFR 312.23(a)(8) requirements for pharmacology and toxicology information.",
  "For the IND application, ensure the Investigator's Brochure (IB) is updated with the latest in vitro metabolic stability data.",
  "I've flagged a potential gap in the CMC (Chemistry, Manufacturing, and Controls) section regarding the stability protocol for the clinical batch.",
  "Based on the mechanism of action, we should anticipate FDA questions regarding off-target effects. I recommend conducting an additional safety pharmacology study.",
  "The protocol for the Phase 1 study needs to explicitly define the stopping rules for dose escalation as per FDA guidance on identifying safe starting doses.",
  "Remember to include the Form FDA 1571 and 1572 in Module 1 of the eCTD structure.",
  "Regarding 21 CFR Part 11.10(e), the key requirement is ensuring that the audit trail captures the exact timestamp of every record creation, modification, or deletion. Your system needs to prevent users from altering these timestamps.",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    let responseContent: string;

    if (message && message.includes('21 CFR Part 11.10(e)')) {
      responseContent = AI_RESPONSES[6];
    } else {
      const randomIndex = Math.floor(Math.random() * (AI_RESPONSES.length - 1));
      responseContent = AI_RESPONSES[randomIndex];
    }

    return NextResponse.json({
      response: responseContent,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}
