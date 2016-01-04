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

/**
 * Represents a path within the chain hierarchy.
 * 
 * @constructor
 * @param {!Array<!string>} parts The parts from which the path is composed.
 */
function LedgerPath(parts) {
    /**
     * The parts from which the path is composed.
     * 
     * @name LedgerPath#parts
     * @type !Array<!string>
     */
    this.parts = parts;
}

/** 
 * Returns the string representation of the path.
 * 
 * @return {string} The string representation of the path.
 */
LedgerPath.prototype.toString = function () {
    return "/" + this.parts.map(function (item) { return item + "/"; }).join("");
};

/** 
 * Parses a chain path from a string.
 * 
 * @param {string} value The value to parse.
 * @return {!LedgerPath} The parsed path.
 */
LedgerPath.parse = function (value) {
    var parts = value.split("/");
    
    if (parts.length < 2 || parts[0] !== "" || parts[parts.length - 1] !== "") {
        throw new Error("Invalid path");
    }
    
    for (var i = 1; i < parts.length - 1; i++) {
        if (parts[i] === "") {
            throw new Error("Invalid path");
        }
    }

    return new LedgerPath(parts.slice(1, parts.length - 1));
};

module.exports = LedgerPath;