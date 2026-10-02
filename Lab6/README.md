# Lab6 
# Performance Testing with Apache JMeter


## Application

Application: Student Management System

## Test Tool

Tool: Apache JMeter 5.6.3
Java: OpenJDK 25.0.3

## Test Plan

JMeter test plan:
`performance_test.jmx`

CSV data file:
`students.csv`

## Workloads

Moderate Load:

* Users: 20
* Ramp-up: 10 seconds
* Measurement duration: 60 seconds

Higher Load:

* Users: 50
* Ramp-up: 20 seconds
* Measurement duration: 60 seconds

Each workload was repeated twice.

## Results

The individual JMeter result files are stored in the `results` folder.

The generated HTML dashboards are stored in the `reports` folder.

## Important Note

During testing, the `/students` endpoint returned HTTP 404 (Not Found). Therefore, errors associated with this endpoint are documented in the performance-test results and should be considered when interpreting the error rate.


