# AI-ML Based Personalized Diet Plan Generator - Milestone 1

## Data Processing Pipeline

Raw Clinical Data
+----------------+-------------------+-----------------+-----------------+
| ICU Vitals     | Lab Results       | Medications     | Fluids          |
+----------------+-------------------+-----------------+-----------------+
        \                  |                   |                  /
         \                 |                   |                 /
          \                |                   |                /
           \               |                   |               /
            \              |                   |              /
             +---------------------------------------------+
             |      Data Preprocessing & Cleaning          |
             +---------------------------------------------+
                            |
                            v
             +---------------------------------------------+
             |   Time-Series Construction (24-Hour Window) |
             | - Aggregate hourly measurements             |
             | - Align all feature groups                  |
             +---------------------------------------------+
                            |
                            v
             +---------------------------------------------+
             |         Feature Engineering & Encoding      |
             | - Vitals normalization                      |
             | - Lab alignment                             |
             | - Medication binary indicators              |
             | - Fluid balance computation                 |
             | - Demographics integration                  |
             +---------------------------------------------+
                            |
                            v
             +---------------------------------------------+
             |          Dataset Assembly & Validation      |
             | - Merge all features into X tensor          |
             | - Extract outcome labels y                  |
             | - Remove incomplete ICU stays               |
             +---------------------------------------------+
                            |
                            v
             +---------------------------------------------+
             |          Model-Ready Dataset Output         |
             | X: [n_patients × 24 hours × n_features]    |
             | y: [n_patients × 1] (mortality)           |
             +---------------------------------------------+
