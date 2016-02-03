// Copyright 2015 Coinprism, Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

var ByteBuffer = require("protobufjs").ByteBuffer;
var ProtoBuf = require("protobufjs");

/*jshint multistr: true */
var schema = "                      \
syntax = 'proto3';                  \
                                    \
package Openchain;                  \
                                    \
message RecordValue {               \
    bytes data = 1;                 \
}                                   \
                                    \
message Record {                    \
    bytes key = 1;                  \
    RecordValue value = 2;          \
    bytes version = 3;              \
}                                   \
                                    \
message Mutation {                  \
    bytes namespace = 1;            \
    repeated Record records = 2;    \
    bytes metadata = 3;             \
}                                   \
                                    \
message Transaction {               \
    bytes mutation = 1;             \
    int64 timestamp = 2;            \
    bytes transaction_metadata = 3; \
}";

var builder = ProtoBuf.loadProto(schema).build();

module.exports = {
    Record: builder.Openchain.Record,
    Mutation: builder.Openchain.Mutation,
    Transaction: builder.Openchain.Transaction
};
