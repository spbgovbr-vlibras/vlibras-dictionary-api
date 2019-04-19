#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author: Erickson Silva
E-Mail: erickson.silva@lavid.ufpb.br

Author: Wesnydy Lima Ribeiro
E-Mail: wesnydy@lavid.ufpb.br
"""

import os
import Trie
import json

from time import sleep

TRIE=None

BUNDLES_PATH=None
BUNDLES_LIST={}

def generate_trie():
    global TRIE
    signs = list(BUNDLES_LIST["DEFAULT"])
    TRIE = json.dumps(Trie.gen(signs))

def list_files(path):
    files = []
    for fname in os.listdir(path):
        path_mount = os.path.join(path, fname)
        if not os.path.isdir(path_mount):
            files.append(fname)
    return files

def check_platform_files():
#    android = set(list_files(BUNDLES_PATH["ANDROID"]))
#    ios = set(list_files(BUNDLES_PATH["IOS"]))
    webgl = set(list_files(BUNDLES_PATH["WEBGL"]))
#    standalone = set(list_files(BUNDLES_PATH["STANDALONE"]))
#    if android == ios and ios == webgl and webgl == standalone:
#        return standalone
    return webgl
    #raise RuntimeError("Inconsistent signs. Check files.")

def list_bundles():
    global BUNDLES_LIST
    states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
              "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
              "RR", "SC", "SP", "SE", "TO"]
    BUNDLES_LIST["DEFAULT"] = check_platform_files()
    for platform, path in BUNDLES_PATH.iteritems():
        BUNDLES_LIST[platform] = {}
        for state in states:
            try:
                BUNDLES_LIST[platform].update({state:set(os.listdir(os.path.join(path, state)))})
            except OSError:
                BUNDLES_LIST[platform].update({state:set([])})

def load_bundles_paths():
    global BUNDLES_PATH
    try:
        SIGNS_PATH=os.environ['BUNDLES_DIR']+"/bundles/"+os.environ['DEFAULT_VERSION']
    except KeyError:
        raise EnvironmentError("Environment variable 'SIGNS_VLIBRAS' not found.")
    #IOS_SIGNS_PATH=os.path.join(SIGNS_PATH, "IOS")
    #ANDROID_SIGNS_PATH=os.path.join(SIGNS_PATH, "ANDROID")
    #STANDALONE_SIGNS_PATH=os.path.join(SIGNS_PATH, "STANDALONE")
    WEBGL_SIGNS_PATH=os.path.join(SIGNS_PATH, "WEBGL")
    #BUNDLES_PATH={"IOS":IOS_SIGNS_PATH, "ANDROID":ANDROID_SIGNS_PATH,
    #                  "STANDALONE":STANDALONE_SIGNS_PATH, "WEBGL":WEBGL_SIGNS_PATH}
    BUNDLES_PATH={"WEBGL":WEBGL_SIGNS_PATH}
    list_bundles()
    generate_trie()


load_bundles_paths()


print TRIE