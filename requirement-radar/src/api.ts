// API functions for requirement scanning

export const convertCustomerJourneyToRequirements = async (
  customerJourney: string,
): Promise<string> => {
  try {
    const response = await fetch(
      'https://workflow.digital.auto/webhook/0df932d3-22ed-4bf9-9748-8602d03b1363',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: customerJourney,
        }),
      },
    );
    const data = await response.json();
    return data?.output || '';
  } catch (error: any) {
    console.error('Error converting customer journey to requirements:', error);
    throw error;
  }
};

export const fetchRequirements = async (input: string, retries = 2): Promise<any[]> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        'https://sematha.digitalauto.tech/api/similarity',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text:
              input ||
              'Requirement: The system must detect a strong impact via the airbag ECU sensor, triggering an event that sends a signal to the SDV App. This signal must initiate the recording of a video and concurrently alert the vehicle owner through an automated email. The entire process, from impact detection to email notification, must be executed within a predefined and safety-critical time frame (e.g., less than 500ms) to ensure timely data capture and owner communication in the event of a crash.',
            similarityThreshold: 0.5,
            topNMatches: 40,
          }),
        },
      );
      const data = await response.json();
      if (!data?.success) throw new Error('No data');
      if (data.matches && Array.isArray(data.matches)) {
        return data.matches || [];
      } else {
        throw new Error('No data');
      }
    } catch (error: any) {
      const isLastAttempt = attempt === retries;
      if (!isLastAttempt) {
        console.log(`Error on attempt ${attempt}, retrying in 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      } else {
        console.error('Error fetching requirements:', error);
        throw error;
      }
    }
  }
  return [];
};

