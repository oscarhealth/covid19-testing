export default {
  name: 'Your Coronavirus / COVID-19 Risk Assessment',
  slug: 'covid-19-intake',
  fields: [
    {name: 'e1s1', type: 'section', options: {showHeader: false}, description: ''},
    {
      name: 'evaluation-details',
      type: 'static',
      options: {
        description:
          "# Are you at higher risk?\n*****\nQuestions in this section help us understand the likelihood of whether or not you've been exposed to the virus or if you’re at risk for complications from COVID-19 if you were to be infected.",
      },
    },
    {
      name: 'healthworker',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 'e1s2yes'},
          {name: 'No', value: false, section: 'p1s1'},
        ],
      },
      description: 'Do you work in a healthcare facility or are a first responder?',
    },
    {name: 'e1s2yes', type: 'section', options: {}, description: 'E1s2yes'},
    {
      name: 'e1s2yes-exposure',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 'p1s1yes'},
          {name: 'No', value: false, section: 'p1s1'},
        ],
      },
      description:
        'Are you concerned about exposure to COVID-19 and or exhibiting symptoms of fever, cough or shortness of breath?',
    },
    {name: 'p1s1yes', type: 'section', options: {}, description: 'P1s1yes'},
    {
      name: 'p1s1yes-chronic-conditions',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 'p1s4yes'},
          {name: 'No', value: false, section: 'p1s4yes'},
        ],
      },
      description:
        ' Do you have any serious chronic medical conditions like heart disease, diabetes or lung disease?',
    },
    {name: 'p1s1', type: 'section', options: {showHeader: false}, description: ''},
    {
      name: 'p1s1-chronic-conditions',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: 'true', section: 'p1s4no'},
          {name: 'No', value: 'false', section: 'p1s4no'},
        ],
      },
      isRequired: true,
      description:
        ' Do you have any serious chronic medical conditions like heart disease, diabetes or lung disease?',
    },
    {name: 'p1s4yes', type: 'section', options: {}, description: 'P1s4yes'},
    {
      name: 'p1s4yes-how-old',
      type: 'radio',
      options: {
        choices: [
          {name: '0-17 years old', value: '0-17-years-old', section: 'p1s5yes'},
          {name: '18-34 years old', value: '18-34-years-old', section: 'p1s5yes'},
          {name: '35-49 years old', value: '35-49-years-old', section: 'p1s5yes'},
          {name: '50-59 years old', value: '50-59-years-old', section: 'p1s5yes'},
          {name: '60-64 years old', value: '60-64-years-old', section: 'p1s5yes'},
          {name: '65-69 years old', value: '65-69-years-old', section: 'p1s5yes'},
          {name: '70-74 years old', value: '70-74-years-old', section: 'p1s5yes'},
          {name: '75-79 years old', value: '75-79-years-old', section: 'p1s5yes'},
          {name: '80-84 years old', value: '80-84-years-old', section: 'p1s5yes'},
          {name: '85 years and older', value: '85-years-and-older', section: 'p1s5yes'},
        ],
      },
      isRequired: true,
      description: 'How old are you?',
    },
    {name: 'p1s4no', type: 'section', options: {}, description: 'P1s4no'},
    {
      name: 'p1s4no-how-old',
      type: 'radio',
      options: {
        choices: [
          {name: '0-17 years old', value: '0-17-years-old', section: 'p1s5no'},
          {name: '18-34 years old', value: '18-34-years-old', section: 'p1s5no'},
          {name: '35-49 years old', value: '35-49-years-old', section: 'p1s5no'},
          {name: '50-59 years old', value: '50-59-years-old', section: 'p1s5no'},
          {name: '60-64 years old', value: '60-64-years-old', section: 'p1s5no'},
          {name: '65-69 years old', value: '65-69-years-old', section: 'p1s5yes'},
          {name: '70-74 years old', value: '70-74-years-old', section: 'p1s5yes'},
          {name: '75-79 years old', value: '75-79-years-old', section: 'p1s5yes'},
          {name: '80-84 years old', value: '80-84-years-old', section: 'p1s5yes'},
          {name: '85 years and older', value: '85-years-and-older', section: 'p1s5yes'},
        ],
      },
      isRequired: true,
      description: 'How old are you?',
    },
    {name: 'p1s5yes', type: 'section', options: {}, description: 'P1s5yes'},
    {
      name: 'p1s5yes-smoked',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 's1s1'},
          {name: 'No', value: false, section: 's1s1'},
        ],
      },
      isRequired: true,
      description: 'Do you smoke?',
    },
    {name: 'p1s5no', type: 'section', options: {}, description: 'P1s5no'},
    {
      name: 'p1s5no-smoked',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 's2s1'},
          {name: 'No', value: false, section: 's2s1'},
        ],
      },
      isRequired: true,
      description: 'Do you smoke?',
    },
    {name: 's1s1', type: 'section', options: {showHeader: false}, description: ''},
    {
      name: 's1-details',
      type: 'static',
      options: {
        description:
          '# Symptom Evaluation\n*****\nQuestions in this section help us understand your current symptoms if you have any. ',
      },
    },
    {
      name: 's1s1-respiratory-symptoms',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 's1s2yes'},
          {name: 'No', value: false, section: 's1s2no'},
        ],
      },
      isRequired: true,
      description:
        'Do you have any respiratory symptoms (cough or shortness of breath)?',
    },
    {name: 's1s2yes', type: 'section', options: {}, description: 'S1s2yes'},
    {
      name: 's1s2-fever',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 'o1-confirmation-section'},
          {name: 'No', value: false, section: 'o3-confirmation-section'},
        ],
      },
      description: 'Do you have a fever greater than 99.6 degrees Fahrenheit?',
    },
    {name: 's1s2no', type: 'section', options: {}, description: 'S1s2no'},
    {
      name: 's1s2no-fever',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 'o2-confirmation-section'},
          {name: 'No', value: false, section: 'o2-confirmation-section'},
        ],
      },
      description: 'Do you have a fever greater than 99.6 degrees Fahrenheit?',
    },
    {name: 's2s1', type: 'section', options: {showHeader: false}, description: ''},
    {
      name: 's2-details',
      type: 'static',
      options: {
        description:
          '# Symptom Evaluation\n*****\nQuestions in this section help us understand your current symptoms if you have any. ',
      },
    },
    {
      name: 's2s1-repiratory-symptoms',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 's2s2yes'},
          {name: 'No', value: false, section: 's2s2no'},
        ],
      },
      isRequired: true,
      description:
        'Do you have any respiratory symptoms (cough or shortness of breath)?',
    },
    {name: 's2s2yes', type: 'section', options: {}, description: 'S2s2yes'},
    {
      name: 's2s2-fever',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 'o3-confirmation-section'},
          {name: 'No', value: false, section: 'o4-confirmation-section'},
        ],
      },
      description: 'Do you have a fever greater than 99.6 degrees Fahrenheit?',
    },
    {name: 's2s2no', type: 'section', options: {}, description: 'S2s2no'},
    {
      name: 's2s2no-fever',
      type: 'radio',
      options: {
        choices: [
          {name: 'Yes', value: true, section: 'o4-confirmation-section'},
          {name: 'No', value: false, section: 'o4-confirmation-section'},
        ],
      },
      description: 'Do you have a fever greater than 99.6 degrees Fahrenheit?',
    },
    {
      name: 'o1-confirmation-section',
      type: 'section',
      options: {},
      description: 'O1 confirmation section',
    },
    {
      name: 'o1-confirmation-question',
      type: 'radio',
      options: {
        choices: [
          {
            name: 'The data I have entered is accurate',
            value: 'the-data-i-have-entered-is-accurate',
            section: 'out1',
          },
        ],
      },
      description: 'Please confirm the data you have entered is accurate.',
    },
    {
      name: 'o2-confirmation-section',
      type: 'section',
      options: {},
      description: 'O2 confirmation section',
    },
    {
      name: 'o2-confirmation-question',
      type: 'radio',
      options: {
        choices: [
          {
            name: 'The data I have entered is accurate',
            value: 'the-data-i-have-entered-is-accurate',
            section: 'out2',
          },
        ],
      },
      description: 'Please confirm the data you have entered is accurate.',
    },
    {
      name: 'o3-confirmation-section',
      type: 'section',
      options: {},
      description: 'O3 confirmation section',
    },
    {
      name: 'o3-confirmation-question',
      type: 'radio',
      options: {
        choices: [
          {
            name: 'The data I have entered is accurate',
            value: 'the-data-i-have-entered-is-accurate',
            section: 'out3',
          },
        ],
      },
      description: 'Please confirm the data you have entered is accurate.',
    },
    {
      name: 'o4-confirmation-section',
      type: 'section',
      options: {},
      description: 'O4 confirmation section',
    },
    {
      name: 'o4-confirmation-question',
      type: 'radio',
      options: {
        choices: [
          {
            name: 'The data I have entered is accurate',
            value: 'the-data-i-have-entered-is-accurate',
            section: 'out4',
          },
        ],
      },
      description: 'Please confirm the data you have entered is accurate.',
    },
    {
      name: 'out1',
      type: 'section',
      options: {},
      description: '# Evaluation Assessment',
    },
    {
      name: 'static-text-80',
      type: 'static',
      options: {
        description:
          '# Recommended for testing \n------\n\nBased on your responses to the questions, you currently meet testing requirements. Please click below to view available test site locations. \n\n\n__BUTTON',
      },
    },
    {
      name: 'out2',
      type: 'section',
      options: {showHeader: false},
      description: '# Evaluation Assessment',
    },
    {
      name: 'static-text-80-copy',
      type: 'static',
      options: {
        description:
          '# Not recommended for testing and no risks\n------\n\nThank you for inquiring about a testing site for COVID-19. Based on your responses to the questions, you currently do not meet testing recommendations.\n',
      },
    },
    {
      name: 'out3',
      type: 'section',
      options: {showHeader: false},
      description: '# Evaluation Assessment',
    },
    {
      name: 'static-text-80-copy-copy',
      type: 'static',
      options: {
        description:
          '# Not recommended for testing and no risks\n------\n\nThank you for inquiring about a testing site for COVID-19. Based on your responses to the questions, you currently do not meet testing recommendations.\n'
      },
    },
    {
      name: 'out4',
      type: 'section',
      options: {showHeader: false},
      description: '# Evaluation Assessment',
    },
    {
      name: 'static-text-80-copy-copy-copy',
      type: 'static',
      options: {
        description:
          '# Not recommended for testing and no risks\n------\n\nThank you for inquiring about a testing site for COVID-19. Based on your responses to the questions, you currently do not meet testing recommendations.\n'
      },
    },
  ],
  version: '0.2',
  sections: [
    {
      slug: 'e1s1',
      fields: ['evaluation-details', 'healthworker'],
      showHeader: false,
      description: '',
    },
    {
      slug: 'e1s2yes',
      fields: ['e1s2yes-exposure'],
      conditions: [{type: 'matches', field: 'healthworker', value: true}],
      description: 'E1s2yes',
    },
    {
      slug: 'p1s1yes',
      fields: ['p1s1yes-chronic-conditions'],
      conditions: [{type: 'matches', field: 'e1s2yes-exposure', value: true}],
      description: 'P1s1yes',
    },
    {
      slug: 'p1s1',
      fields: ['p1s1-chronic-conditions'],
      conditions: [
        {type: 'matches', field: 'healthworker', value: false},
        {type: 'matches', field: 'e1s2yes-exposure', value: false},
      ],
      showHeader: false,
      description: '',
    },
    {
      slug: 'p1s4yes',
      fields: ['p1s4yes-how-old'],
      conditions: [
        {type: 'matches', field: 'p1s1yes-chronic-conditions', value: true},
        {type: 'matches', field: 'p1s1yes-chronic-conditions', value: false},
      ],
      description: 'P1s4yes',
    },
    {
      slug: 'p1s4no',
      fields: ['p1s4no-how-old'],
      conditions: [
        {type: 'matches', field: 'p1s1-chronic-conditions', value: 'true'},
        {type: 'matches', field: 'p1s1-chronic-conditions', value: 'false'},
      ],
      description: 'P1s4no',
    },
    {
      slug: 'p1s5yes',
      fields: ['p1s5yes-smoked'],
      conditions: [
        {type: 'matches', field: 'p1s4yes-how-old', value: '0-17-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '18-34-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '35-49-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '50-59-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '60-64-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '65-69-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '70-74-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '75-79-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '80-84-years-old'},
        {type: 'matches', field: 'p1s4yes-how-old', value: '85-years-and-older'},
        {type: 'matches', field: 'p1s4no-how-old', value: '65-69-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '70-74-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '75-79-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '80-84-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '85-years-and-older'},
      ],
      description: 'P1s5yes',
    },
    {
      slug: 'p1s5no',
      fields: ['p1s5no-smoked'],
      conditions: [
        {type: 'matches', field: 'p1s4no-how-old', value: '0-17-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '18-34-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '35-49-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '50-59-years-old'},
        {type: 'matches', field: 'p1s4no-how-old', value: '60-64-years-old'},
      ],
      description: 'P1s5no',
    },
    {
      slug: 's1s1',
      fields: ['s1-details', 's1s1-respiratory-symptoms'],
      conditions: [
        {type: 'matches', field: 'p1s5yes-smoked', value: true},
        {type: 'matches', field: 'p1s5yes-smoked', value: false},
      ],
      showHeader: false,
      description: '',
    },
    {
      slug: 's1s2yes',
      fields: ['s1s2-fever'],
      conditions: [{type: 'matches', field: 's1s1-respiratory-symptoms', value: true}],
      description: 'S1s2yes',
    },
    {
      slug: 's1s2no',
      fields: ['s1s2no-fever'],
      conditions: [{type: 'matches', field: 's1s1-respiratory-symptoms', value: false}],
      description: 'S1s2no',
    },
    {
      slug: 's2s1',
      fields: ['s2-details', 's2s1-repiratory-symptoms'],
      conditions: [
        {type: 'matches', field: 'p1s5no-smoked', value: true},
        {type: 'matches', field: 'p1s5no-smoked', value: false},
      ],
      showHeader: false,
      description: '',
    },
    {
      slug: 's2s2yes',
      fields: ['s2s2-fever'],
      conditions: [{type: 'matches', field: 's2s1-repiratory-symptoms', value: true}],
      description: 'S2s2yes',
    },
    {
      slug: 's2s2no',
      fields: ['s2s2no-fever'],
      conditions: [{type: 'matches', field: 's2s1-repiratory-symptoms', value: false}],
      description: 'S2s2no',
    },
    {
      slug: 'o1-confirmation-section',
      fields: ['o1-confirmation-question'],
      conditions: [{type: 'matches', field: 's1s2-fever', value: true}],
      description: 'O1 confirmation section',
    },
    {
      slug: 'o2-confirmation-section',
      fields: ['o2-confirmation-question'],
      conditions: [
        {type: 'matches', field: 's1s2no-fever', value: true},
        {type: 'matches', field: 's1s2no-fever', value: false},
      ],
      description: 'O2 confirmation section',
    },
    {
      slug: 'o3-confirmation-section',
      fields: ['o3-confirmation-question'],
      conditions: [
        {type: 'matches', field: 's1s2-fever', value: false},
        {type: 'matches', field: 's2s2-fever', value: true},
      ],
      description: 'O3 confirmation section',
    },
    {
      slug: 'o4-confirmation-section',
      fields: ['o4-confirmation-question'],
      conditions: [
        {type: 'matches', field: 's2s2-fever', value: false},
        {type: 'matches', field: 's2s2no-fever', value: true},
        {type: 'matches', field: 's2s2no-fever', value: false},
      ],
      description: 'O4 confirmation section',
    },
    {
      slug: 'out1',
      fields: ['static-text-80'],
      conditions: [
        {
          type: 'matches',
          field: 'o1-confirmation-question',
          value: 'the-data-i-have-entered-is-accurate',
        },
      ],
      description: '# Evaluation Assessment',
    },
    {
      slug: 'out2',
      fields: ['static-text-80-copy'],
      conditions: [
        {
          type: 'matches',
          field: 'o2-confirmation-question',
          value: 'the-data-i-have-entered-is-accurate',
        },
      ],
      showHeader: false,
      description: '# Evaluation Assessment',
    },
    {
      slug: 'out3',
      fields: ['static-text-80-copy-copy'],
      conditions: [
        {
          type: 'matches',
          field: 'o3-confirmation-question',
          value: 'the-data-i-have-entered-is-accurate',
        },
      ],
      showHeader: false,
      description: '# Evaluation Assessment',
    },
    {
      slug: 'out4',
      fields: ['static-text-80-copy-copy-copy'],
      conditions: [
        {
          type: 'matches',
          field: 'o4-confirmation-question',
          value: 'the-data-i-have-entered-is-accurate',
        },
      ],
      showHeader: false,
      description: '# Evaluation Assessment',
    },
  ],
  description:
    'Please take the quick survey below to see if you meet the recommended criteria for receiving a Coronavirus / COVID-19 test.\n',
};
