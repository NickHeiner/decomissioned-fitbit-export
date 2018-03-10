provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "query-fitbit" {
  filename         = "../lambda/query-fitbit.zip"
  function_name    = "query-fitbit"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  handler          = "index.handler"
  source_code_hash = "${base64sha256(file("../lambda/query-fitbit.zip"))}"
  runtime          = "nodejs6.10"
}

data "aws_subnet" "east_1e" {
  id = "subnet-942f3aa9"
}

data "aws_subnet" "east_1c" {
  id = "subnet-6527d12c"
}

data "aws_subnet" "east_1b" {
  id = "subnet-7ec6c054"
}

data "aws_subnet" "east_1d" {
  id = "subnet-da3c3a82"
}

resource "aws_db_subnet_group" "default" {
  name = "db_subnet_group"

  subnet_ids = [
    "${data.aws_subnet.east_1e.id}",
    "${data.aws_subnet.east_1c.id}",
    "${data.aws_subnet.east_1b.id}",
    "${data.aws_subnet.east_1d.id}",
  ]

  tags {
    Name = "db_subnet_group"
  }
}

# I don't know how to set the schema or otherwise run SQL, so I just connect and do it manually.
resource "aws_db_instance" "fitbit_export_db" {
  allocated_storage         = 20
  storage_type              = "gp2"
  engine                    = "mysql"
  engine_version            = "5.7.21"
  instance_class            = "db.t2.micro"
  identifier                = "fitbit-export-db"
  name                      = "fitbit_export_db"
  username                  = "${var.db_username}"
  password                  = "${var.db_password}"
  db_subnet_group_name      = "${aws_db_subnet_group.default.name}"
  backup_retention_period   = 35
  monitoring_interval       = 60
  monitoring_role_arn       = "arn:aws:iam::387412527620:role/rds-monitoring-role"
  vpc_security_group_ids    = ["sg-bc3b89ca"]
  final_snapshot_identifier = "fitbit-export-db-final-snapshot"

  # When I made an instance through the console, I was able to get more logs (slow query, audit, etc).
  # I don't know how to enable them here.
  # However, they can be manually enabled in the AWS console after the instance is created.
}
