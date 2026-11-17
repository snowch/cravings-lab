// Authored educational content. Understanding checks are not stored or scored.
export const lessons = [
  {
    id: 'craving-habit-control', title: 'Craving, habit or loss of control?',
    summary: 'Different experiences can feel similar. Learn why the distinction matters.',
    idea: 'A strong urge tells you what you want. It does not, by itself, tell you whether you can choose.',
    paragraphs: [
      'A craving is a strong desire for a particular food. A habit is a response that becomes familiar in a recurring situation, such as reaching for chocolate when a television programme starts. Either can happen without an eating disorder.',
      'Loss of control means feeling unable to stop or to control what or how much you eat. That is different from deliberately choosing more food than planned. You cannot reliably tell the difference from a food photograph, a portion size or a glucose reading.',
      'The Diagnostic and Statistical Manual of Mental Disorders (DSM-5-TR) does not list “sugar addiction” or “chocolate addiction” as diagnoses. Binge-eating disorder and bulimia nervosa are. This lab cannot diagnose them. Repeated loss of control or distress is a reason to seek assessment, even if you are unsure whether your experience counts as a binge.'
    ],
    example: 'Sam really wants chocolate after dinner, chooses to have some, and enjoys it. Alex describes feeling unable to stop eating and feels distressed afterwards. The same food does not make these the same experience.',
    question: 'Someone says, “I really wanted chocolate tonight.” What can we conclude?',
    answers: [
      {
        text: 'They have an addiction.',
        feedback: 'A craving describes what someone wants. To understand their experience, ask whether they felt able to choose and whether they felt distressed.'
      },
      {
        text: 'They felt a strong desire. We need more context to understand what happened.',
        feedback: 'A strong desire can accompany an intentional choice or a feeling of being unable to stop. Ask what happened and how it felt.'
      },
      {
        text: 'They should stop eating chocolate completely.',
        feedback: 'The statement describes a desire. It gives no reason to recommend a food ban.'
      },
    ], correct: 1,
    action: 'Notice your own context', href: '#check-in',
    source: 'NICE: assessment and treatment guidance', url: 'https://www.nice.org.uk/guidance/ng69/chapter/Recommendations'
  },
  {
    id: 'cues-and-learning', title: 'How cues become habits',
    summary: 'Explore the situation → response → immediate outcome pattern.',
    idea: 'A familiar cue can bring an urge to mind before you have deliberately decided what you want.',
    paragraphs: [
      'Eating can become associated with a time, place, activity, feeling or social situation. Repeating a response in that setting can make it feel automatic. Chocolate also combines flavour, texture, aroma and learned associations; a preference is not proof of a unique chemical dependence.',
      'One useful description is cue → response → immediate outcome. For example: finishing work → reaching for chocolate → pleasure or a transition out of work. This is a hypothesis about a pattern, not a complete explanation of why anyone eats.',
      'You can explore one part of the pattern: pause to notice the transition, change the routine, or deliberately choose a snack. The aim is flexibility and adequate nourishment, not making foods forbidden or removing every possible cue.'
    ],
    example: 'Rae notices chocolate often appears with evening television. They try deciding what they want before starting the programme. Some evenings they choose chocolate; other evenings they want a meal or a rest.',
    question: 'Which experiment best explores a television-related habit?',
    answers: [
      {
        text: 'Ban chocolate and treat any eating as failure.',
        feedback: 'A ban removes one choice. This experiment asks whether a change in timing helps the person choose more deliberately.'
      },
      {
        text: 'Try choosing what to eat before the programme and notice whether it feels more deliberate.',
        feedback: 'Changing when you decide gives you something concrete to compare. Notice how the choice feels on evenings when you decide before the programme.'
      },
      {
        text: 'Assume television caused every craving.',
        feedback: 'Television is a possible cue. Other factors, such as hunger or tiredness, can also change from evening to evening.'
      },
    ], correct: 1,
    action: 'Explore a cue experiment', href: '#experiments',
    source: 'Sugar addiction: the state of the science', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5174153/'
  },
  {
    id: 'hunger-and-restriction', title: 'Start with enough food',
    summary: 'Why hunger and restriction deserve attention before urge-management tools.',
    idea: 'You do not need to delay eating, reduce a craving or complete a practice to deserve food.',
    paragraphs: [
      'Hunger and a desire for a particular food can coexist. If you have missed meals or have not eaten enough, a satisfying meal or snack may be more useful than a distraction exercise. A hunger rating records how you feel in the moment.',
      'The National Institute for Health and Care Excellence (NICE) recommends regular meals and snacks as part of cognitive behavioural therapy (CBT) for binge-eating disorder. Its guidance advises against weight-loss dieting during treatment because restriction can trigger binge eating. This is guidance for clinical care.',
      'Avoid turning an episode of eating into a reason to fast, skip the next meal or exercise to compensate. If food rules are becoming rigid, or you are unsure what adequate eating looks like for you, a qualified professional can help. Discuss changes with your clinician if you have diabetes or are following an individual treatment plan.'
    ],
    example: 'Jo has skipped lunch and feels very hungry after work. An urge to eat chocolate is present too. Eating something satisfying is a reasonable response; a ten-minute delay is not a necessary first step.',
    question: 'After a missed meal, which response fits this lab’s approach?',
    answers: [
      {
        text: 'Use the pause timer to prove you can resist hunger.',
        feedback: 'A pause is optional. If you are hungry after missing a meal, you can eat without using a timer.'
      },
      {
        text: 'Skip dinner if you have already eaten chocolate.',
        feedback: 'You can still have dinner after eating chocolate. Skipping the next meal can leave hunger unaddressed.'
      },
      {
        text: 'Respond to hunger with food. Use an optional practice only if it is useful.',
        feedback: 'Food can address hunger after a missed meal. A craving practice is available whenever it feels useful.'
      },
    ], correct: 2,
    action: 'Practise checking your needs', href: '#tool/needs',
    source: 'NICE: CBT for binge-eating disorder', url: 'https://www.nice.org.uk/guidance/ng69/chapter/Recommendations'
  },
  {
    id: 'thoughts-and-choice', title: 'A thought is not an instruction',
    summary: 'Practise noticing a craving thought and choosing how to respond.',
    idea: 'You can notice a thought without having to fight it or automatically obey it.',
    paragraphs: [
      'Cognitive defusion means relating to a thought as a mental event. Instead of “I need chocolate now”, try “I’m noticing the thought that I need chocolate now.” The thought may feel less like an instruction, even if the craving stays.',
      'This is not a test of willpower or a demand to persuade yourself that chocolate is bad. You can choose to eat. You can also address hunger, tiredness, stress or another need. The useful question is whether the exercise gives you more flexibility.',
      'Brief psychological craving techniques show modest, mixed effects, often in short laboratory studies. They are not guaranteed to reduce intake or craving, and evidence for lasting everyday benefits is thinner. A practice that does not help today is information, not a personal failure.'
    ],
    example: '“I need chocolate now” becomes “I’m having the thought that I need chocolate now.” The urge remains. Morgan notices a choice and decides to enjoy chocolate. The exercise has not failed simply because they ate.',
    question: 'An urge remains after a defusion exercise. What does that mean?',
    answers: [
      {
        text: 'The exercise can still be useful if it helped someone choose more deliberately.',
        feedback: 'The exercise can help someone notice a choice while the thought is still present. That choice can include eating.'
      },
      {
        text: 'They did the exercise incorrectly.',
        feedback: 'The urge can remain after the person notices their options. Its intensity alone tells you little about how they used the exercise.'
      },
      {
        text: 'They must repeat it until the urge disappears.',
        feedback: 'The person can finish the practice with the urge still there. They can decide what to do next whenever they are ready.'
      },
    ], correct: 0,
    action: 'Try cognitive defusion', href: '#tool/defusion',
    source: 'Review of laboratory-based craving interventions', url: 'https://pubmed.ncbi.nlm.nih.gov/31944559/'
  },
  {
    id: 'patterns-not-proof', title: 'Patterns are clues, not proof',
    summary: 'Make sense of check-ins without overinterpreting numbers or devices.',
    idea: 'A few useful observations can help you ask a better question. They cannot establish a cause or a diagnosis.',
    paragraphs: [
      'A lightweight check-in can capture hunger, craving and context while they are fresh. But you choose when to record, and you may log difficult moments more often than ordinary ones. Ten evening entries do not tell you the frequency of cravings across your whole life.',
      'If stress and cravings appear together, several explanations are possible. Missed meals, tiredness or the situation itself may also matter. Watch sleep data can add context, but watches cannot detect loss of control. A continuous glucose monitor measures glucose levels. Its readings cannot tell you whether someone has a craving or an addiction.',
      'Track only what helps you understand. Exact calories, weighing food and daily targets are not needed here. If tracking brings guilt, compulsive checking or increased restriction, pause or stop. Less tracking can be the more helpful choice.'
    ],
    example: 'Four check-ins mention stress. That suggests “Would a more supported work break help?” It does not establish “Stress causes all my eating” or “A wearable can diagnose emotional eating.”',
    question: 'Most recorded urges happened after short sleep. What is a fair interpretation?',
    answers: [
      {
        text: 'Short sleep definitely caused the urges.',
        feedback: 'The entries show that the two experiences occurred together. Other factors, such as missed meals or stress, could also matter.'
      },
      {
        text: 'The entries show a possible pattern worth exploring.',
        feedback: 'You can use the pattern to ask a question about sleep, while remembering that you chose which moments to record.'
      },
      {
        text: 'A smartwatch has diagnosed compulsive eating.',
        feedback: 'A watch can provide sleep data. Feeling unable to stop eating is an experience a watch cannot assess.'
      },
    ], correct: 1,
    action: 'Explore your recorded patterns', href: '#reflect',
    source: 'NICE: assessment should consider the wider picture', url: 'https://www.nice.org.uk/guidance/ng69/chapter/Recommendations'
  },
  {
    id: 'kind-experiments', title: 'Make change an experiment',
    summary: 'Choose one manageable change, reflect kindly, and know when support matters more.',
    idea: 'A useful experiment helps you learn what supports you. It does not grade your eating.',
    paragraphs: [
      'Start with a question, such as “Would making time for lunch help me feel more settled in the evening?” Choose one manageable change, then decide what you want to notice. More deliberate choices, less distress and adequate eating can matter more than a count of chocolate-free days.',
      'Try the change for a few days or about a week if it feels useful. Review sooner if it makes things harder. Look at what helped, what got in the way and whether the situation changed too. Personal experiments are imperfect: improvement does not prove a single cause, and no change is still useful information.',
      'Recurrent loss of control, significant distress, purging, compensatory fasting or eating difficulties that disrupt daily life deserve professional support. You do not have to finish lessons, log more data or reach a certain weight before asking. Guided self-help and eating-disorder-focused cognitive behavioural therapy are treatments for binge-eating disorder. Use this lab for self-reflection.'
    ],
    example: 'Lee plans a regular lunch on workdays and notices whether evenings feel less frantic. A difficult day leads to a more manageable lunch plan, not a punishment or a new food ban.',
    question: 'An experiment increases guilt and restriction. What is a useful next step?',
    answers: [
      {
        text: 'Make the rules stricter so the experiment succeeds.',
        feedback: 'More restriction could make the experiment harder. Feeling worse is a reason to reconsider the plan.'
      },
      {
        text: 'Collect more entries before you are allowed to stop.',
        feedback: 'You can stop whenever you choose. No minimum number of entries is required to finish an experiment.'
      },
      {
        text: 'Pause or stop, reflect on what happened, and seek support if eating is distressing.',
        feedback: 'Increased guilt or restriction is useful information about the plan. You can pause and ask for support whenever you need it.'
      },
    ], correct: 2,
    action: 'Choose a small experiment', href: '#experiments',
    source: 'NHS: treatment and support for binge-eating disorder', url: 'https://www.nhs.uk/mental-health/conditions/binge-eating/treatment/'
  }
];
