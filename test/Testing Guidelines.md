# Testing Guidelines -- Trivia Frontend

## 1. General Principles

-   Test actual behaviour, not implementation details.
-   Follow the Arrange--Act--Assert (AAA) pattern.
-   Use descriptive test names that explain the expected behaviour.
-   Prefer concise, readable tests over complicated setups.
-   Avoid unnecessary mocks, abstractions, helpers, and test cases.
-   Do not write tests merely to increase code coverage.
-   Test meaningful normal, boundary, and edge-case scenarios.
-   Do not change production code simply to make tests easier to write.
-   Do not introduce business rules that are not part of the intended
    functionality.
-   A test should help identify a regression and make the expected
    behaviour clear.

## 2. Test Structure and Naming

-   Mirror the `src` folder structure in the test folder.
-   Use `describe` to group related functionality.
-   Use `it` for individual behaviours.
-   Prefer `it.each()` when multiple scenarios verify the same
    behaviour.
-   Use `beforeEach()` for shared setup when it improves readability.
-   Use `afterEach()` for necessary cleanup.
-   Use `vi.fn()` for simple function mocks.
-   Use `vi.mock()` only when mocking an entire module is justified.
-   Follow existing project naming conventions.

Keep unrelated behaviours in separate tests. Do not force
parameterization when it makes tests harder to understand.

## 3. Arrange--Act--Assert (AAA)

Structure tests consistently:

``` ts
it('describes the expected behaviour', () => {
  // Arrange

  // Act

  // Assert
})
```

-   Keep each section focused.
-   Do not add empty Arrange or Act sections.
-   Keep setup close to the test that needs it.
-   Avoid unnecessary helper functions and abstractions.

## 4. Utility Tests

Test utility functions independently whenever possible.

For pure functions:

-   Do not mock dependencies.
-   Test normal inputs, boundaries, and relevant edge cases.
-   Consider unexpected but technically valid inputs.
-   Verify return values and relevant output structures.

For mapping functions:

-   Verify all mapped properties.
-   Verify default values.
-   Verify collections and nested objects.
-   Cover supported enum values and scenarios.
-   Prefer comparing complete objects with `toEqual()` when appropriate.

Do not add validation or error-handling requirements that the function
does not promise to provide.

## 5. Composable Tests

Composables contain application behaviour and should receive meaningful
functional tests.

Test where applicable:

-   Initial state.
-   State changes.
-   Return values.
-   User interaction flows.
-   Conditional behaviour.
-   Boundary and edge cases.
-   Error handling.
-   Interactions with injected dependencies.

Mock external dependencies, such as services and API calls, rather than
the logic being tested.

-   Prefer real implementations of other composables when practical.
-   Use Vue refs, reactive state, and lifecycle utilities as needed.
-   Properly await asynchronous behaviour.
-   Clean up mounted wrappers and other resources after tests.

## 6. Service Tests

Service tests verify communication with external dependencies.

Test where applicable:

-   HTTP method.
-   Endpoint.
-   Query parameters.
-   Request body.
-   Response handling.
-   Error handling and rejected requests.

Use a fake or mocked HTTP client. Never make actual network requests in
unit tests.

## 7. Mocking Rules

Mock only what is necessary.

Preferred approach:

Test target            Mocking approach
  ---------------------- --------------------------------------------------
Utilities              No mocks
Composables            Mock injected services and external dependencies
Services               Mock or fake the HTTP client
Components and views   Avoid excessive mocking and stubbing

-   Never mock the function or behaviour that the test is intended to
    verify.
-   Avoid large mock setups that make tests harder to understand than
    the production code.

## 8. Component and View Tests

Every component and view should have meaningful tests covering three
areas.

### 8.1 Snapshot

-   Include a snapshot test for each component and view.
-   Use snapshots to capture meaningful rendered structure.
-   Keep snapshots intentional and review changes when they are updated.
-   Do not rely on snapshots as the only form of testing.

### 8.2 Rendering

-   Verify that the component or view renders correctly.
-   Verify important content and structure.
-   Verify conditional content where applicable.
-   Verify that slots and relevant props affect the rendered output.

### 8.3 Functionality

-   Test important user-visible behaviour, such as emitted events,
    interactions, and navigation where applicable.
-   Verify that props produce the expected behaviour.
-   Cover meaningful conditional states and edge cases.
-   Test behaviour at component level only when it belongs to that
    component.

Keep component and view tests lightweight. Avoid duplicating extensive
composable or service tests.

Do not create elaborate Vuetify stubs or mock setups just to test basic
rendering. Use the project's existing component test setup.

## 9. Edge Cases and Expected Behaviour

Always consider relevant cases such as:

-   Empty collections.
-   Zero values.
-   Boundary values.
-   Missing optional values.
-   Null values where supported.
-   Unexpected but technically valid inputs.
-   Error responses.
-   Repeated calls where state could be affected.

Use `it.each()` to cover multiple inputs for the same behaviour where it
improves readability.

Before testing an edge case, determine the intended behaviour from the
implementation, requirements, or agreed business rules.

-   Do not automatically treat unexpected inputs as invalid.
-   Do not assume an edge case should throw or reject.
-   If the intended behaviour is unclear, ask before changing production
    code.

Tests should document the agreed contract, not invent one.

## 10. Test Quality and Maintainability

-   Keep tests concise, readable, and useful.
-   Remove redundant tests.
-   Avoid testing the same behaviour at multiple layers without a clear
    reason.
-   Keep test data simple and readable.
-   Prefer small scenario objects over complicated factories.
-   Avoid unnecessary interfaces for simple test data.
-   Keep assertions focused on the behaviour being tested.
-   Use `toEqual()` for object and array comparisons.
-   Use `toBe()` for primitive values.
-   Use `toHaveBeenCalledWith()` to verify dependency interactions.
-   Use snapshots intentionally; do not update them blindly.
-   Prefer a small number of meaningful tests over many trivial tests.

## 11. Working on Existing Tests

When reviewing or improving existing tests:

1.  Understand the production code first.
2.  Identify the responsibility of the function or component.
3.  Identify the behaviours that need verification.
4.  Identify redundant, brittle, or unnecessary tests.
5.  Simplify the test setup without losing meaningful coverage.
6.  Preserve important existing scenarios.
7.  Add missing meaningful edge cases.
8.  Run the tests and verify the results when possible.

-   Do not rewrite an entire test suite without understanding its
    purpose.
-   Do not remove difficult tests without first determining whether they
    cover important behaviour.

## 12. Import Paths and TypeScript Conventions

-   Never use `@` aliases in test imports. They do not work in this
    project setup.
-   Use relative imports that resolve correctly from the test file.
-   Follow the project's file-extension conventions.
-   Do not add `.ts` extensions to imports if the project TypeScript
    configuration disallows them.
-   Use `import type` for type-only imports.

## 13. Setup and Cleanup Hooks

### `beforeEach()`

Use `beforeEach()` for shared setup that needs to run before each test,
such as:

-   Initialising common test data.
-   Creating fresh mocks or resetting mock implementations.
-   Setting up Pinia or other required test environments.
-   Initialising wrapper tracking arrays or shared test state.

### `afterEach()`

Use `afterEach()` for cleanup that needs to happen after each test, such
as:

-   Unmounting Vue wrappers.
-   Restoring spies and mocks with `vi.restoreAllMocks()`.
-   Restoring stubbed globals and environment variables.
-   Resetting shared state to prevent tests affecting each other.

Use these hooks when they make setup and cleanup clearer; do not add
them when they are unnecessary.

## 14. Example Component Test

The following example demonstrates the project's preferred structure and
conventions.

``` ts
import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Button from '../../../../src/views/components/generics/Button.vue'

const VBtnStub = defineComponent({
  props: {
    block: Boolean,
    color: String,
    disabled: Boolean,
    loading: Boolean,
    minWidth: [String, Number],
    size: String,
    type: String,
  },
  emits: {
    click: () => true,
  },
  template: `
    <button
      :disabled="disabled"
      :type="type"
      @click="$emit('click')"
    >
      <slot />
    </button>
  `,
})

describe('Button', () => {
  let wrappers: VueWrapper[] = []

  afterEach(() => {
    wrappers.forEach(wrapper => wrapper.unmount())
    wrappers = []
  })

  const mountButton = (options = {}) => {
    const wrapper = mount(Button, {
      ...options,
      global: {
        stubs: {
          VBtn: VBtnStub,
        },
      },
    })

    wrappers.push(wrapper)
    return wrapper
  }

  describe('Rendering', () => {
    it('matches the snapshot', () => {
      // Arrange
      const wrapper = mountButton({
        slots: { default: 'Continue' },
      })

      // Assert
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders its slot content', () => {
      // Arrange
      const wrapper = mountButton({
        slots: { default: 'Save changes' },
      })

      // Assert
      expect(wrapper.text()).toContain('Save changes')
    })

    it.each([
      { scenario: 'enabled', disabled: false },
      { scenario: 'disabled', disabled: true },
    ])('renders an $scenario button correctly', ({ disabled }) => {
      // Arrange
      const wrapper = mountButton({ props: { disabled } })

      // Assert
      expect((wrapper.find('button').element as HTMLButtonElement).disabled)
        .toBe(disabled)
    })
  })

  describe('Props', () => {
    it.each([
      {
        scenario: 'default props',
        props: {},
        expected: {
          block: false,
          color: 'primary',
          disabled: false,
          loading: false,
          minWidth: 160,
          size: 'large',
          type: 'button',
        },
      },
      {
        scenario: 'custom props',
        props: {
          block: true,
          disabled: true,
          loading: true,
          minWidth: '200px',
          type: 'submit' as const,
        },
        expected: {
          block: true,
          color: 'primary',
          disabled: true,
          loading: true,
          minWidth: '200px',
          size: 'large',
          type: 'submit',
        },
      },
      ...(['button', 'submit', 'reset'] as const).map(type => ({
        scenario: `${type} button type`,
        props: { type },
        expected: { type },
      })),
    ])('passes $scenario to Vuetify', ({ props, expected }) => {
      // Arrange
      const wrapper = mountButton({ props })

      // Assert
      expect(wrapper.findComponent(VBtnStub).props()).toMatchObject(expected)
    })
  })

  describe('Click behaviour', () => {
    it('emits a click event when clicked', async () => {
      // Arrange
      const wrapper = mountButton()

      // Act
      await wrapper.find('button').trigger('click')

      // Assert
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })
})
```

## 15. Final Objective

The goal is not to maximize test count or code coverage.

The goal is a test suite that is:

-   Readable.
-   Concise.
-   Maintainable.
-   Reliable.
-   Consistent.
-   Focused on actual application behaviour.
-   Useful for detecting regressions.

A good test clearly communicates what the code is expected to do and why
that behaviour matters.
