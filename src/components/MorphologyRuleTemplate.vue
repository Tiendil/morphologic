<template>

<h-block :grow="grow"
         :center="true"
         :leftArrow="EXPRESSION_TYPE.SET.is(template.type)"
         :rightArrow="EXPRESSION_TYPE.ALTERNATIVE.is(template.type)"
         :horizontalLeft="allowEdit"
         :horizontalRight="true"
         :vertical="vertical"
         :verticalUp="verticalUp"
         :verticalDown="verticalDown">

  <morphology-item-chip v-if="EXPRESSION_TYPE.ITEM.is(template.type)"
                        class="mt-1 mb-1"
                        :item-id="template.data.itemId"
                        :onClose="allowEdit && removeSelf"/>


  <template v-else-if="EXPRESSION_TYPE.SET.is(template.type)">

    <template v-for="expression in template.data.expressions">

      <morphology-item-selector v-if="allowEdit"
                                :onSelect="addAlternative"
                                :onSelectArguments="{expressionUID: expression.uid}"
                                icon="mdi-table-row-plus-after"
                                plusColor="blue"/>

      <morphology-rule-template :template="expression"
                                :key="expression.uid"
                                :rootTemplate="rootTemplate"
                                :mode="mode"
                                class="d-inline-flex"/>

    </template>

    <morphology-item-selector v-if="allowEdit"
                              :onSelect="addItem"
                              icon="mdi-plus"
                              plusColor="green"/>

  </template>


  <div v-else-if="EXPRESSION_TYPE.ALTERNATIVE.is(template.type)"
       class="d-flex flex-column a">
    <morphology-rule-template v-for="(expression, index) in template.data.expressions"
                              :template="expression"
                              :key="expression.uid"
                              :rootTemplate="rootTemplate"
                              :mode="mode"
                              :vertical="true"
                              :verticalUp="index != 0"
                              :verticalDown="index != (template.data.expressions.length - 1)"
                              class="d-flex"/>
  </div>

</h-block>

</template>

<script>

import * as templates from '@/logic/templates.js';

import { Fragment } from 'vue-fragment'
import MorphologyItemChip from "@/components/MorphologyItemChip";
import MorphologyItemSelector from "@/components/MorphologyItemSelector";


let HConnector = {
    name: "HConnector",

    data: () => ({}),

    props: {"grow": {'default': false}},

    computed: {

        classes () {
            if (this.grow) {
                return 'd-inline-flex flex-grow-1';
            }

            return 'd-inline-flex flex-grow-0';
        }

    },

    template: '<div :class="classes" style="min-width: 5px; height: 3px; background-color: black;"/>'

}


let HArrow = {
    name: "HArrow",

    data: () => ({}),

    props: {},

    computed: {

    },

    template: `
<div style="width: 0; height: 0; border-top: 4px solid transparent; border-left: 12px solid black; border-bottom: 5px solid transparent;"/>`

}


let VConnector = {
    name: "VConnector",

    data: () => ({}),

    props: {'up': {'default': true},
            'down': {'default': true},
            'color': {'default': 'black'}},

    computed: {
        upColor() {
            if (this.up) {
                return this.color;
            }

            return 'transparent';
        },

        downColor() {
            if (this.down) {
                return this.color;
            }

            return 'transparent';
        }
    },

    template: `
<div class="d-inline-flex flex-column align-self-stretch connector" style="width: 3px;">
<div class="flex-grow-1" :style="'background-color: ' + upColor + ';'"/>
<div class="flex-grow-0" :style="'height: 3px; background-color: ' + color + ';'"/>
<div class="flex-grow-1" :style="'background-color: ' + downColor + ';'"/>
</div>`

}



let HBlock = {
    name: "HBlock",

    components: {
        HConnector,
        VConnector,
        HArrow
    },

    data: () => ({}),

    props: {'grow': {'default': true},
            'center': {'default': true},
            'leftArrow': {'default': true},
            'rightArrow': {'default': true},
            'vertical': {'default': false},
            'verticalUp': {'default': true},
            'verticalDown': {'default': true},
            'horizontalLeft': {'default': true},
            'horizontalRight': {'default': true}},

    computed: {
        containerClasses () {
            if (this.center) {
                return 'd-inline-flex align-center';
            }

            return 'd-inline-flex'
        }
    },

    template: `
<div :class="containerClasses">
<v-connector v-if="vertical" :up="verticalUp" :down="verticalDown"/>
<h-connector v-if="horizontalLeft || leftArrow" :grow="grow"/>
<h-arrow v-if="leftArrow"/>
<slot/>
<h-connector v-if="horizontalRight || rightArrow" :grow="grow"/>
<h-arrow v-if="rightArrow"/>
<v-connector v-if="vertical" :up="verticalUp" :down="verticalDown"/>
</div>`

}


export default {
    name: "MorphologyRuleTemplate",

    components: {
        Fragment,
        MorphologyItemChip,
        MorphologyItemSelector,
        HConnector,
        VConnector,
        HBlock
    },

    data: () => ({}),

    props: {'grow': {'default': true},
            'mode': {},
            'vertical': {'default': false},
            'template': {'default': null},
            'verticalUp': {'default': true},
            'verticalDown': {'default': true},
            'rootTemplate': {}},

    computed: {

        EXPRESSION_TYPE () {
            return templates.EXPRESSION_TYPE;
        },

        allowEdit () {
            return this.mode == 'edit';
        }

    },

    methods: {
        addItem (itemId) {
            const itemExpression = templates.exprItem({itemId: itemId});
            templates.addExpression({root: this.template, child: itemExpression});
        },

        removeSelf () {
            this.removeRule(this.template.uid);
        },

        removeRule (ruleUID) {
            templates.removeExpressionFull({expression: this.rootTemplate, uid: ruleUID});
        },

        addAlternative (itemId, args) {

            if (templates.EXPRESSION_TYPE.ITEM.is(this.template.type)) {
                throw 'Can not create alternative for item block';
            }

            const itemExpression = templates.exprItem({itemId: itemId});
            const setExpression = templates.exprSet()
            templates.addExpression({root: setExpression, child: itemExpression});

            if (templates.EXPRESSION_TYPE.SET.is(this.template.type)) {
                const index = templates.subexpressionIndexByUID({expression: this.template,
                                                                 uid: args.expressionUID});

                let baseExpression = this.template.data.expressions[index];

                if (templates.EXPRESSION_TYPE.ALTERNATIVE.is(baseExpression.type)) {
                    templates.addExpression({root: baseExpression, child: setExpression});
                    return;
                }

                const alternative = templates.exprAlternative()

                if (templates.EXPRESSION_TYPE.ITEM.is(baseExpression.type)) {
                    const setExpression = templates.exprSet()
                    templates.addExpression({root: setExpression, child: baseExpression});
                    baseExpression = setExpression;
                }

                templates.addExpression({root: alternative, child: baseExpression});
                templates.addExpression({root: alternative, child: setExpression});

                templates.replaceExpression({expression: this.template,
                                             uid: args.expressionUID,
                                             newExpression: alternative});

                return;
            }

            if (templates.EXPRESSION_TYPE.ALTERNATIVE.is(this.template.type)) {
                throw 'items in alternatives add only thow "set" blocks';
                return;
            }
        }
    }
}
</script>
